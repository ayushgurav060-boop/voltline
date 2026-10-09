
const API = import.meta.env.VITE_API_URL || '';

const json = async res => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

const post = body => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

export const getProducts = params =>
  fetch(`${API}/api/products?` + new URLSearchParams(params)).then(json);

export const getProduct = id =>
  fetch(`${API}/api/products/${id}`).then(json);

export const placeOrder = order =>
  fetch(`${API}/api/orders`, post(order)).then(json);

export const getOrder = id =>
  fetch(`${API}/api/orders/${id}`).then(json);

export const inr = n => '₹' + n.toLocaleString('en-IN');