
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Home,
  AllProducts,
  ProductPage,
  CartPage,
  Checkout,
  OrderPage,
  NotFound,
} from "./pages";

import { useCart } from "./cart";
import { useEffect, useState } from "react";

const API = "/api";

// HEADER
function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { count } = useCart();

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") || "").trim();

    if (query) {
      navigate("/products?q=" + encodeURIComponent(query));
    } else {
      navigate("/products");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("voltlineUser");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="top">
      <Link to="/" className="logo">
        Voltline
      </Link>

      <form onSubmit={handleSearch} role="search" className="search">
        <input
          name="q"
          key={searchParams.get("q") || ""}
          defaultValue={searchParams.get("q") || ""}
          placeholder="Search phones, laptops, headphones"
          aria-label="Search products"
        />
        <button type="submit">Search</button>
      </form>

      <div className="header-right">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>

            <Link to="/orders" className="login-link">
              My Orders
            </Link>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}

        <Link to="/cart" className="cartlink">
          Cart <b>{count}</b>
        </Link>
      </div>
    </header>
  );
}

// LOGIN PAGE
function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      localStorage.setItem("voltlineUser", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">Voltline</div>
        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to your Voltline account
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <div className="login-options">
            <label className="remember-option">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <span className="forgot-password">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <Link to="/" className="guest-button">
          Continue as Guest
        </Link>

        <p className="create-account">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

// REGISTER PAGE
function Register({ setUser }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create account.");
      }

      localStorage.setItem("voltlineUser", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">Voltline</div>
        <h1>Create Account</h1>
        <p className="login-subtitle">
          Create your Voltline account
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </label>

          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <label className="login-field">
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="create-account">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

// MY ORDERS PAGE
function MyOrders({ user }) {
  return (
    <section className="wrap">
      <h1>My Orders</h1>

      {!user ? (
        <p>
          Please <Link to="/login">sign in</Link> to view your orders.
        </p>
      ) : (
        <p>
          Welcome, {user.name}. You are signed in to Voltline.
        </p>
      )}

      <Link to="/products">Continue Shopping</Link>
    </section>
  );
}

// MAIN APP
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("voltlineUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("voltlineUser");
      }
    }
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/orders" element={<MyOrders user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="foot">
        Voltline is a demo store built with React, Express and MongoDB.
      </footer>
    </>
  );
}