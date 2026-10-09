import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import {
  getProducts,
  getProduct,
  placeOrder,
  getOrder,
  inr
} from './api';
import { useCart } from './cart';

const CATS = [
  'All',
  'Mobiles',
  'Laptops',
  'Headphones',
  'Accessories'
];

function useLoad(fn, deps) {
  const [state, setState] = useState({
    data: null,
    error: ''
  });

  useEffect(() => {
    let live = true;

    setState({ data: null, error: '' });

    fn()
      .then(data => {
        if (live) setState({ data, error: '' });
      })
      .catch(e => {
        if (live) setState({ data: null, error: e.message });
      });

    return () => {
      live = false;
    };
    // eslint-disable-next-line
  }, deps);

  return state;
}

const Msg = ({ cls = '', children }) => (
  <div className="wrap narrow">
    <p className={`note ${cls}`}>{children}</p>
  </div>
);

/* =========================
   HOME PAGE
   ========================= */

export function Home() {
  const { data, error } = useLoad(
    () => getProducts({}),
    []
  );

  const categories = [
    { name: 'Mobiles', icon: '📱' },
    { name: 'Laptops', icon: '💻' },
    { name: 'Headphones', icon: '🎧' },
    { name: 'Accessories', icon: '🔌' }
  ];

  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(135deg, #10243e, #1c4770)',
          color: '#fff',
          padding: '64px 28px',
          borderRadius: '18px',
          margin: '24px auto',
          maxWidth: '1200px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <p
            style={{
              color: '#8fd3ff',
              fontWeight: 800,
              letterSpacing: '2px'
            }}
          >
            WELCOME TO VOLTLINE
          </p>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.1,
              margin: '12px 0'
            }}
          >
            Technology for your everyday life.
          </h1>

          <p
            style={{
              lineHeight: 1.8,
              color: '#e1eaf5',
              fontSize: '1.05rem'
            }}
          >
            Discover smartphones, laptops, headphones and useful
            accessories, all in one place.
          </p>

          <Link
            to="/products"
            className="btn"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              background: '#fff',
              color: '#142b4a',
              textDecoration: 'none'
            }}
          >
            Shop All Products →
          </Link>
        </div>
      </section>

      <section className="wrap">
        <h2>Shop by Category</h2>

        <div className="chips">
          {categories.map(category => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="btn"
              style={{ textDecoration: 'none' }}
            >
              {category.icon} {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section
        className="wrap"
        style={{ marginTop: '36px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <h2>Featured Products</h2>
          <Link to="/products">View All Products →</Link>
        </div>

        {error && (
          <p className="note err">
            {error}. Check that the API is running on port 5000.
          </p>
        )}

        {!data && !error && (
          <p className="note">Loading featured products…</p>
        )}

        {data && data.length === 0 && (
          <p className="note">No products are available yet.</p>
        )}

        {data && data.length > 0 && (
          <div className="grid">
            {data.slice(0, 4).map(p => (
              <Card key={p._id} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================
   COMMON COMPONENTS
   ========================= */

export const NotFound = () => (
  <Msg>
    Page not found. <Link to="/products">Browse products</Link>
  </Msg>
);

const EmptyCart = () => (
  <Msg>
    Your cart is empty. <Link to="/products">Browse products</Link>
  </Msg>
);

const Stock = ({ n }) =>
  n === 0 ? (
    <span className="tag out">Out of stock</span>
  ) : n <= 5 ? (
    <span className="tag low">Only {n} left</span>
  ) : (
    <span className="tag">In stock</span>
  );

const Specs = ({ specs, limit }) => (
  <dl className="specs">
    {Object.entries(specs || {})
      .slice(0, limit)
      .map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
  </dl>
);

function ProductImage({ p, big = false }) {
  return (
    <Link
      to={`/product/${p._id}`}
      className={`tile ${p.category} ${big ? 'big' : ''}`}
      aria-label={`View ${p.name}`}
      style={{
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        background: '#f5f7f8'
      }}
    >
      <img
        src={p.image}
        alt={p.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        onError={e => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.style.background = '#dce5e9';
        }}
      />

      <span
        style={{
          position: 'absolute',
          left: '14px',
          bottom: '12px',
          background: 'rgba(255,255,255,.88)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: big ? '1.8rem' : '1.2rem',
          fontWeight: 800,
          color: '#14232e'
        }}
      >
        {p.brand}
      </span>
    </Link>
  );
}

function Card({ p }) {
  const { add } = useCart();

  return (
    <article className="card">
      <ProductImage p={p} />

      <div className="body">
        <h3>
          <Link to={`/product/${p._id}`}>{p.name}</Link>
        </h3>

        <Specs specs={p.specs} limit={3} />

        <div className="row">
          <strong className="price">{inr(p.price)}</strong>
          <Stock n={p.stock} />
        </div>

        <button
          className="btn"
          disabled={!p.stock}
          onClick={() => add(p)}
        >
          {p.stock ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </article>
  );
}

/* =========================
   ALL PRODUCTS PAGE
   ========================= */

export function AllProducts() {
  const [sp, setSp] = useSearchParams();

  const q = sp.get('q') || '';
  const category = sp.get('category') || 'All';
  const sort = sp.get('sort') || '';

  const { data, error } = useLoad(
    () => getProducts({ q, category, sort }),
    [q, category, sort]
  );

  const set = (k, v) => {
    const n = new URLSearchParams(sp);

    if (v && v !== 'All') {
      n.set(k, v);
    } else {
      n.delete(k);
    }

    setSp(n);
  };

  return (
    <section className="wrap">
      <h1>
        {q ? `Results for “${q}”` : 'All Products'}
      </h1>

      <div className="bar">
        <div className="chips">
          {CATS.map(c => (
            <button
              key={c}
              className={c === category ? 'on' : ''}
              onClick={() => set('category', c)}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="sort">
          Sort by
          <select
            value={sort}
            onChange={e => set('sort', e.target.value)}
          >
            <option value="">Featured</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="note err">
          {error}. Check that the API is running on port 5000.
        </p>
      )}

      {!data && !error && (
        <p className="note">Loading products…</p>
      )}

      {data && !data.length && (
        <p className="note">
          No products match.{' '}
          <button
            className="link"
            onClick={() => setSp({})}
          >
            Clear search and filters
          </button>
        </p>
      )}

      {data && (
        <div className="grid">
          {data.map(p => (
            <Card key={p._id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================
   PRODUCT DETAILS PAGE
   ========================= */

export function ProductPage() {
  const { id } = useParams();
  const { add } = useCart();

  const { data: p, error } = useLoad(
    () => getProduct(id),
    [id]
  );

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (error) {
    return (
      <Msg cls="err">
        {error}. <Link to="/products">Back to products</Link>
      </Msg>
    );
  }

  if (!p) {
    return <Msg>Loading…</Msg>;
  }

  return (
    <section className="wrap detail">
      <ProductImage p={p} big />

      <div>
        <p className="crumb">
          <Link to="/products">All products</Link> / {p.category}
        </p>

        <h1>{p.name}</h1>

        <p className="crumb">
          Rated {Number(p.rating || 0).toFixed(1)} out of 5
        </p>

        <p className="price big">{inr(p.price)}</p>

        <Stock n={p.stock} />

        <p className="desc">{p.description}</p>

        {p.stock > 0 && (
          <div className="row buy">
            <label>
              Quantity{' '}
              <input
                type="number"
                min="1"
                max={p.stock}
                value={qty}
                onChange={e =>
                  setQty(
                    Math.max(
                      1,
                      Math.min(p.stock, +e.target.value || 1)
                    )
                  )
                }
              />
            </label>

            <button
              className="btn"
              onClick={() => {
                add(p, qty);
                setAdded(true);
              }}
            >
              Add to cart
            </button>
          </div>
        )}

        {added && (
          <p className="note ok">
            Added to cart. <Link to="/cart">View cart</Link>
          </p>
        )}

        <h2>Specifications</h2>
        <Specs specs={p.specs} />
      </div>
    </section>
  );
}

/* =========================
   CART PAGE
   ========================= */

export function CartPage() {
  const { items, setQty, remove, total } = useCart();

  if (!items.length) {
    return <EmptyCart />;
  }

  return (
    <section className="wrap narrow">
      <h1>Your cart</h1>

      <ul className="lines">
        {items.map(i => (
          <li key={i._id}>
            <div>
              <Link to={`/product/${i._id}`}>
                {i.name}
              </Link>
              <small>{i.brand}</small>
            </div>

            <input
              type="number"
              aria-label={`Quantity for ${i.name}`}
              min="1"
              max={i.stock}
              value={i.qty}
              onChange={e =>
                setQty(i._id, +e.target.value || 1)
              }
            />

            <strong>{inr(i.price * i.qty)}</strong>

            <button
              className="link"
              onClick={() => remove(i._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="total">
        <span>Total</span>
        <strong>{inr(total)}</strong>
      </div>

      <Link to="/checkout" className="btn">
        Continue to checkout
      </Link>
    </section>
  );
}

/* =========================
   CHECKOUT PAGE
   ========================= */

export function Checkout() {
  const { items, total, clear } = useCart();
  const nav = useNavigate();

  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!items.length) {
    return <EmptyCart />;
  }

  const on = k => e => {
    setF({ ...f, [k]: e.target.value });
  };

  const submit = async e => {
    e.preventDefault();

    setBusy(true);
    setErr('');

    try {
      const o = await placeOrder({
        customer: f,
        items: items.map(i => ({
          productId: i._id,
          name: i.name,
          qty: i.qty
        }))
      });

      clear();
      nav(`/order/${o._id}`);
    } catch (x) {
      setErr(x.message);
      setBusy(false);
    }
  };

  return (
    <section className="wrap narrow">
      <h1>Checkout</h1>

      <form onSubmit={submit} className="form">
        <label>
          Full name
          <input
            required
            value={f.name}
            onChange={on('name')}
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={f.email}
            onChange={on('email')}
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            value={f.phone}
            onChange={on('phone')}
          />
        </label>

        <label>
          Delivery address
          <textarea
            required
            rows="3"
            value={f.address}
            onChange={on('address')}
          />
        </label>

        <div className="total">
          <span>Order total, pay on delivery</span>
          <strong>{inr(total)}</strong>
        </div>

        {err && (
          <p className="note err">{err}</p>
        )}

        <button className="btn" disabled={busy}>
          {busy ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </section>
  );
}

/* =========================
   ORDER CONFIRMATION PAGE
   ========================= */

export function OrderPage() {
  const { id } = useParams();

  const { data: o, error } = useLoad(
    () => getOrder(id),
    [id]
  );

  if (error) {
    return <Msg cls="err">{error}</Msg>;
  }

  if (!o) {
    return <Msg>Loading…</Msg>;
  }

  return (
    <section className="wrap narrow">
      <h1>Order placed</h1>

      <p className="note ok">
        Thanks, {o.customer.name}. Order{' '}
        {o._id.slice(-8)} will be delivered to{' '}
        {o.customer.address}. Pay on delivery.
      </p>

      <ul className="lines">
        {o.items.map(i => (
          <li key={i._id}>
            <div>
              {i.name}
              <small>Quantity {i.qty}</small>
            </div>

            <strong>
              {inr(i.price * i.qty)}
            </strong>
          </li>
        ))}
      </ul>

      <div className="total">
        <span>Total</span>
        <strong>{inr(o.total)}</strong>
      </div>

      <Link to="/products" className="btn">
        Keep shopping
      </Link>
    </section>
  );
}