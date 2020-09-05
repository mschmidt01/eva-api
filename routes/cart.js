const express = require('express');
const MenuItem = require('../models/menuitem');
const app = express();
const mongoose = require('mongoose');

app.get('/cart', async (req, res) => {
  let cart = req.session.cart;
  let cartContent = [];
  let mongooseIds = [];
  if (cart !== undefined) {
    for(let i = 0; i < cart.length; i++){
      let item = cart[i];
      let id = mongoose.Types.ObjectId(item.id);
      mongooseIds.push(id);
    }
    MenuItem.find({
      '_id': { $in: mongooseIds}
  }, function(err, docs){
       console.log(docs);
  });
  }
  const menuitems = await MenuItem.find({});

  try {
    res.send(menuitems);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/cart', async (req, res) => {
  try {
    let id = req.body.menuItemId;
    let cart = req.session.cart;
    if (cart === undefined) {
      cart = [];
    }
    let item = cart.find(item => item.id === id);
    if (item === undefined) {
      item = { id: id, qty: 1 };
      cart.push(item);
    } else {
      item.qty++;
    }
    req.session.cart = cart;
    res.send({
      status: "success",
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/cart/count', async (req, res) => {
  try {
    let cart = req.session.cart;
    let count = 0;
    console.log(cart);
    if (cart !== undefined) {
      for(let i = 0; i < cart.length; i++){
        let item = cart[i];
        count += item.qty;
      }
    }
    
    res.send({
      status: "success", data:{count: count},
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/cart/:id', async (req, res) => {
  try {
    const menuitem = await MenuItem.findByIdAndDelete(req.params.id)

    if (!menuitem) res.status(404).send("No item found")
    res.status(200).send()
  } catch (err) {
    res.status(500).send(err)
  }
})

app.patch('/cart/:id', async (req, res) => {
  try {
    const menuitem = await MenuItem.findByIdAndUpdate(req.params.id, req.body)
    await MenuItem.save()
    res.send(menuitem)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = app