const { Schema, model } = require('mongoose');

const Product = model('Product', new Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  category: { type: String, required: true, enum: ['Mobiles', 'Laptops', 'Headphones', 'Accessories'] },
  price: { type: Number, required: true, min: 0 },
  description: String,
  specs: Schema.Types.Mixed,
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 4, min: 0, max: 5 }
}, { timestamps: true }));

const Order = model('Order', new Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: { type: String, required: true }
  },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: Number }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Placed' }
}, { timestamps: true }));

module.exports = { Product, Order };
