const express = require('express');
const Customer = require('../models/customer');
const app = express();

app.get('/customers', async (req, res) => {
  const customers = await Customer.find({});

  try {
    res.send(customers);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/customer', async (req, res) => {
    const customer = new Customer(req.body);
  
    try {
      await customer.save();
      res.send(customer);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/customer/:id', async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id)
  
      if (!customer) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/customer/:id', async (req, res) => {
    try {
      const customer =  await Customer.findByIdAndUpdate(req.params.id, req.body)
      res.send(customer)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app