const express = require('express');
const MenuItem = require('../models/menuitem');
const app = express();
const AWS = require('aws-sdk');
const ID = 'AKIAJM3CCPJ325QNJUPQ';
const BUCKET_NAME = 'eva-image-b4d1bf14c8';
const SECRET = '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';
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: 'eu-central-1'
});

app.get('/menuitems', async (req, res) => {
  console.log(req.cookies);
  const menuitems = await MenuItem.find({});

  try {
    res.send(menuitems);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/menuitem', async (req, res) => {

  let imageData = req.body.imageData;

  let MenuItemContent = req.body;
  var categoryId = new mongoose.mongo.ObjectId(req.body.categoryID);
  MenuItemContent.categoryID = categoryId;
  if (imageData !== null){
    const awsImageKey =  uuidv4();
    MenuItemContent.awsimagekey = awsImageKey;

    buf = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""),'base64');
    var data = {
      Key: awsImageKey,
      Bucket: BUCKET_NAME, 
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };
    let uploadData = await s3.upload(data, function(err, data){
        if (err) { 
          console.log(err);
          console.log('Error uploading data: ', data); 
        } else {
          console.log('succesfully uploaded the image!');
          console.log(data);
        }
        
    }).promise();
    MenuItemContent.image = uploadData.Location;
  }
  
  delete MenuItemContent.imageData;

    const menuitem = new MenuItem(MenuItemContent);
  
    try {
      await menuitem.save();
      res.send(menuitem);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/menuitem/:id', async (req, res) => {
    try {
      var menuitem = await MenuItem.findById(req.params.id).exec();
      const awsImageKey = menuitem.awsimagekey;
      menuitem = await MenuItem.findByIdAndDelete(req.params.id)
      var params = {  Bucket: BUCKET_NAME, Key: awsImageKey };
      if (!menuitem) res.status(404).send("No item found")
      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log();                 // deleted
      });
      res.status(200).send()
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message)
    }
  })

  app.patch('/menuitem/:id', async (req, res) => {
    try {
      let MenuItemContent = req.body;
      let imageData = req.body.imageData;

      var categoryId = new mongoose.mongo.ObjectId(req.body.categoryID);
      MenuItemContent.categoryID = categoryId;

      if (imageData !== undefined && imageData !== null){
        var menuitem = await MenuItem.findById(req.params.id).exec();
        var awsImageKey = menuitem.awsimagekey;
        var params = {  Bucket: BUCKET_NAME, Key: awsImageKey };
        if (!menuitem) res.status(404).send("No item found")
        await s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  // error
          else     console.log();                 // deleted
        }).promise();
        awsImageKey =  uuidv4();
        MenuItemContent.awsimagekey = awsImageKey;
    
        buf = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""),'base64');
        var data = {
          Key: awsImageKey,
          Bucket: BUCKET_NAME, 
          Body: buf,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
        };
        let uploadData = await s3.upload(data, function(err, data){
            if (err) { 
              console.log(err);
              console.log('Error uploading data: ', data); 
            } else {
              console.log('succesfully uploaded the image!');
              console.log(data);
            }
            
        }).promise();
        MenuItemContent.image = uploadData.Location;
      }
      menuitem =  await MenuItem.findByIdAndUpdate(req.params.id, MenuItemContent);
      res.send(menuitem)
    } catch (err) {
      res.status(500).send(err.message)
    }
  })

module.exports = app