const router = require("express").Router();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Product, Order } = require("./models");

const wrap = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);

const str = (v) => String(v ?? "").trim();

const escapeRe = (s) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sorts = {
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
};

/* =========================================================
   USER / AUTHENTICATION
   ========================================================= */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);


/* =========================================================
   CREATE ACCOUNT
   POST /api/auth/register
   ========================================================= */

router.post(
  "/auth/register",
  wrap(async (req, res) => {
    const name = str(req.body.name);
    const email = str(req.body.email).toLowerCase();
    const password = str(req.body.password);

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please fill in all fields.",
      });
    }

   
if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must contain at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  })
);


/* =========================================================
   LOGIN
   POST /api/auth/login
   ========================================================= */

router.post(
  "/auth/login",
  wrap(async (req, res) => {
    const email = str(req.body.email).toLowerCase();
    const password = str(req.body.password);

    if (!email || !password) {
      return res.status(400).json({
        error: "Please enter your email and password.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    res.json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  })
);


/* =========================================================
   GET USER
   GET /api/auth/user/:id
   ========================================================= */

router.get(
  "/auth/user/:id",
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: "Invalid user ID.",
      });
    }

    const user = await User.findById(req.params.id).select(
      "_id name email"
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  })
);


/* =========================================================
   PRODUCTS
   ========================================================= */

// List / search products
// ?q=&category=&sort=

router.get(
  "/products",
  wrap(async (req, res) => {
    const q = str(req.query.q);
    const category = str(req.query.category);

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (q) {
      const re = new RegExp(escapeRe(q), "i");

      filter.$or = [
        { name: re },
        { brand: re },
        { category: re },
      ];
    }

    res.json(
      await Product.find(filter).sort(
        sorts[req.query.sort] || { createdAt: 1 }
      )
    );
  })
);


/* =========================================================
   SINGLE PRODUCT
   ========================================================= */

router.get(
  "/products/:id",
  wrap(async (req, res) => {
    const p =
      mongoose.isValidObjectId(req.params.id) &&
      await Product.findById(req.params.id);

    if (!p) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(p);
  })
);


/* =========================================================
   PLACE ORDER
   ========================================================= */

router.post(
  "/orders",
  wrap(async (req, res) => {
    const { customer = {}, items } = req.body;

    const c = {
      name: str(customer.name),
      email: str(customer.email),
      phone: str(customer.phone),
      address: str(customer.address),
    };

    if (
      !c.name ||
      !/^\S+@\S+\.\S+$/.test(c.email) ||
      !c.address ||
      !Array.isArray(items) ||
      !items.length
    ) {
      return res.status(400).json({
        error:
          "Enter your name, a valid email, a delivery address and at least one item",
      });
    }

    const lines = [];

    const rollback = () =>
      Promise.all(
        lines.map((l) =>
          Product.updateOne(
            { _id: l.product },
            { $inc: { stock: l.qty } }
          )
        )
      );

    for (const it of items) {
      const qty = Math.min(
        20,
        Math.max(1, parseInt(it.qty) || 1)
      );

      const p = mongoose.isValidObjectId(it.productId)
        ? await Product.findOneAndUpdate(
            {
              _id: it.productId,
              stock: { $gte: qty },
            },
            {
              $inc: { stock: -qty },
            }
          )
        : null;

      if (!p) {
        await rollback();

        return res.status(400).json({
          error: `${
            str(it.name) || "An item"
          } is out of stock or no longer available`,
        });
      }

      lines.push({
        product: p._id,
        name: p.name,
        price: p.price,
        qty,
      });
    }

    const total = lines.reduce(
      (s, l) => s + l.price * l.qty,
      0
    );

    const order = await Order.create({
      customer: c,
      items: lines,
      total,
    });

    res.status(201).json(order);
  })
);


/* =========================================================
   SINGLE ORDER
   ========================================================= */

router.get(
  "/orders/:id",
  wrap(async (req, res) => {
    const o =
      mongoose.isValidObjectId(req.params.id) &&
      await Order.findById(req.params.id);

    if (!o) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.json(o);
  })
);


module.exports = router;