const express = require('express');
const MenuItem = require('../models/menuitem');
const app = express();
const mongoose = require('mongoose');

app.get('/cart', async (req, res) => {
  let cart = req.session.cart;
  try {
    res.send({status: "success", data:cart});
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/cart', async (req, res) => {
  try {
    let id = req.body.menuItemId;
    let cart = req.session.cart;
    if (cart == null) {
      cart = {
        cartitems: [],
        price: 0.0,
      };
    }
    let item = cart.cartitems.find(item => item._id === id);
    if (item == null) {
      await MenuItem.findById(id, function (err, doc) {
        if (doc == null) res.status(404).send("No item found")
        let item = doc.toObject();
        item.qty = 1;
        item.menuitemprice = parseFloat(item.menuitemprice.toJSON()["$numberDecimal"]);
        cart.cartitems.push(item);
        cart.price +=  item.menuitemprice;
        
      })
    } else {
      item.qty++;
      cart.price += item.menuitemprice;
    }
    req.session.cart = cart;
    console.log(req.session.cart);
    res.send({
      status: "success",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/cart/count', async (req, res) => {
  try {
    let cart = req.session.cart;
    let count = 0;
    console.log(cart);
    if (cart.cartitems !== undefined) {
      for (let i = 0; i < cart.cartitems.length; i++) {
        let item =  cart.cartitems[i];
        count += item.qty;
      }
    }
    res.send({
      status: "success",
      data: {
        count: count
      },
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