const express = require('express');
const User = require('../models/user');
const app = express();

app.get('/users', async (req, res) => {
  const users = await User.find({});

  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/user', async (req, res) => {
    const user = new User(req.body);
  
    try {
      await user.save();
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/user/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
  
      if (!user) res.status(404).send("No item found")
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.patch('/user/:id', async (req, res) => {
    try {
      const user =  await User.findByIdAndUpdate(req.params.id, req.body)
      await User.save()
      res.send(user)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app