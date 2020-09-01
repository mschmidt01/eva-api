const express = require('express');
const Table = require('../models/table');
const app = express();
const { v4: uuidv4 } = require('uuid');

app.get('/tables', async (req, res) => {
  const tables = await Table.find({});

  try {
    res.send(tables);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/table', async (req, res) => {
    let table = new Table(req.body);
    
    try {
      let tmp = await table.save();
      let secret = uuidv4();
      tmp.QRCodeLink = 'http://localhost:3006/?table='+ tmp._id + '&s=' + secret;
      tmp.secret =  secret; 
      await tmp.save()
      res.send(tmp);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.delete('/table/:id', async (req, res) => {
    try {
      const table = await Table.findByIdAndDelete(req.params.id)
  
      if (!table) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/table/:id', async (req, res) => {
    try {
      const table =  await Table.findByIdAndUpdate(req.params.id, req.body)
      await Table.save()
      res.send(table)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app