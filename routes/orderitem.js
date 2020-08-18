const express = require('express');
const OrderItem = require('../models/orderitem');
const app = express();

app.get('/orderitems', async (req, res) => {
  const orderitems = await OrderItem.find({});

  try {
    res.send(orderitems);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/orderitem', async (req, res) => {
    const orderitem = new OrderItem(req.body);
  
    try {
      await orderitem.save();
      res.send(orderitem);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/orderitem/:id', async (req, res) => {
    try {
      const orderitem = await OrderItem.findByIdAndDelete(req.params.id)
  
      if (!orderitem) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/orderitem/:id', async (req, res) => {
    try {
      const orderitem =  await OrderItem.findByIdAndUpdate(req.params.id, req.body)
      await OrderItem.save()
      res.send(orderitem)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app