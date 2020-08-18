const express = require('express');
const Table = require('../models/table');
const app = express();

app.get('/tables', async (req, res) => {
  const tables = await Table.find({});

  try {
    res.send(tables);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/table', async (req, res) => {
    const table = new Table(req.body);
  
    try {
      await table.save();
      res.send(table);
    } catch (err) {
      res.status(500).send(err);
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