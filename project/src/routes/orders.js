import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Create order
router.post('/',
  auth,
  [
    body('products').isArray(),
    body('products.*.product').notEmpty(),
    body('products.*.quantity').isNumeric()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let totalAmount = 0;
      const products = [];

      // Calculate total and verify stock
      for (let item of req.body.products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.product} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }

        totalAmount += product.price * item.quantity;
        products.push({
          product: item.product,
          quantity: item.quantity
        });

        // Update stock
        product.stock -= item.quantity;
        await product.save();
      }

      const order = new Order({
        user: req.user.userId,
        products,
        totalAmount
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;