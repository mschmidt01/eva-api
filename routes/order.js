const express = require('express');
const Order = require('../models/order');
const app = express();

app.get('/orders', async (req, res) => {
  const orders = await Order.find({});

  try {
    res.send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/order', async (req, res) => {
    const order = new Order(req.body);
  
    try {
      await order.save();
      res.send(order);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/order/:id', async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id)
  
      if (!order) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/order/:id', async (req, res) => {
    try {
      const order =  await Order.findByIdAndUpdate(req.params.id, req.body)
      await Order.save()
      res.send(order)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app