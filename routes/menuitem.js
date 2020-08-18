const express = require('express');
const MenuItem = require('../models/menuitem');
const app = express();

app.get('/menuitems', async (req, res) => {
  const menuitems = await MenuItem.find({});

  try {
    res.send(menuitems);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/menuitem', async (req, res) => {
    const menuitem = new MenuItem(req.body);
  
    try {
      await menuitem.save();
      res.send(menuitem);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/menuitem/:id', async (req, res) => {
    try {
      const menuitem = await MenuItem.findByIdAndDelete(req.params.id)
  
      if (!menuitem) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/menuitem/:id', async (req, res) => {
    try {
      const menuitem =  await MenuItem.findByIdAndUpdate(req.params.id, req.body)
      await MenuItem.save()
      res.send(menuitem)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app