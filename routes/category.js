const express = require('express');
const Category = require('../models/category');
const MenuItem = require('../models/menuitem')
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
      const categoryId = req.params.id;
      let ObjectId = require('mongodb').ObjectId;
      const c_id = new ObjectId(categoryId);
      MenuItem.findOne({categoryID: c_id}, async function (err, menuitem) {
        if(!menuitem){ 
          const category = await Category.findByIdAndDelete(categoryId);
          if (!category) res.status(404).send("No item found");
          res.status(200).send()
        } else {
            res.send({status: 'fail', data:{ title: "Kann nicht gelöscht werden, da sich mindestens noch ein Menuitem in dieser Kategorie befindet."}});
        }
      })
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