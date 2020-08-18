const express = require('express');
const Category = require('../models/category');
const app = express();

app.get('/categories', async (req, res) => {
  const categories = await Category.find({});

  try {
    res.send(categories);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/category', async (req, res) => {
    const category = new Category(req.body);
  
    try {
      await category.save();
      res.send(category);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/category/:id', async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id)
  
      if (!category) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/category/:id', async (req, res) => {
    try {
      const category =  await Category.findByIdAndUpdate(req.params.id, req.body)
      await Category.save()
      res.send(category)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app