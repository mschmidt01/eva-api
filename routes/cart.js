const express = require('express');
const MenuItem = require('../models/menuitem');
const app = express();
const mongoose = require('mongoose');

app.get('/cart', async (req, res) => {
  let cart = req.session.cart;
  let price = 0.0;
  for (let i = 0; i < cart.cartitems.length; i++) {
    price += cart.cartitems[i].menuitemprice * cart.cartitems[i].qty;
  }
  

  cart.price = (Math.round(price * 100) / 100).toFixed(2);;
  try {
    res.send({status: "success", data:JSON.stringify(cart)});
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/cart', async (req, res) => {
  try {
    let id = req.body.menuItemId;
    let cart = req.session.cart;
    console.log("aaa", cart);
    if (cart === null) {
      cart = {
        cartitems: [],
        price: 0.0,
      };
      cart = req.session.cart;
    }
    console.log("bbb", cart);
    let item = cart.cartitems.find(item => item._id === id);
    if (item === undefined) {
      MenuItem.findById(id, function (err, doc) {
        if (doc === null) res.status(404).send("No item found")
        item = doc.toObject();
        item.qty = 1;
        console.log("ccc", item);
        //item.menuitemprice =  (Math.round(parseFloat(item.menuitemprice.toJSON()["$numberDecimal"]).toFixed(2) * 100) / 100).toFixed(2);
        cart.cartitems.push(item);
        req.session.cart = cart;
        console.log("ddd", req.session.cart); 
      })
    } else {
      console.log("111", item);
      item.qty++;
      req.session.cart = cart;
      console.log("eee", req.session.cart); 
    }
       
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
    if(cart === null){
      return 0;
    }
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

app.patch('/cart', async (req, res) => {
  try {
  let id = req.body.menuItemId;
  let qty = req.body.qty;
  let cart = req.session.cart;
  let item = cart.cartitems.find(item => item._id === id);
  if(qty === 0){
    const filterInPlace = (array, predicate) => {
      let end = 0;
  
      for (let i = 0; i < array.length; i++) {
          const obj = array[i];
  
          if (predicate(obj)) {
              array[end++] = obj;
          }
      }
  
      array.length = end;
  };
  
  const toDelete = new Set([item._id]);
  
  filterInPlace(cart.cartitems, obj => !toDelete.has(obj._id));
  res.status(200).send();
  }else{
    console.log(cart);
    item.qty = qty;
    req.session.cart = cart;
    console.log(cart);
    res.status(200).send();
  }
  

} catch (err) {
    res.status(500).send(err)
  }
})

module.exports = app