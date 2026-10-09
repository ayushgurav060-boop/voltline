import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext();
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, set] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);

  const add = (p, qty = 1) => set(c => {
    const line = c.find(x => x._id === p._id);
    if (line) return c.map(x => x._id === p._id ? { ...x, qty: Math.min(p.stock, x.qty + qty) } : x);
    return [...c, { _id: p._id, name: p.name, brand: p.brand, price: p.price, stock: p.stock, qty: Math.min(p.stock, qty) }];
  });
  const setQty = (id, qty) => set(c => c.map(x => x._id === id ? { ...x, qty: Math.max(1, Math.min(x.stock, qty)) } : x));
  const remove = id => set(c => c.filter(x => x._id !== id));
  const clear = () => set([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</Ctx.Provider>;
}
