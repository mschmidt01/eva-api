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
    let items = req.body.cartItems;
    let tableId = req.body.tableId;
    let timeStamp = req.body.timeStamp;
    // let secret = req.body.secret; TODO: Use Secret to prevent trolls
    let orderContent = {
      TableId: tableId, 
    // CustomerId: String, //TODO: CustomerID?
    OrderItems: items,
    StatusPayed: false,
    OrderTimeStamp: timeStamp,
    }
    const order = new Order(orderContent);
  
    try {
      await order.save();
      req.session.cart = null;
      res.send({status: 'success', data: {order: order}});
    
    } catch (err) {
      res.status(500).send({status: 'error'});
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