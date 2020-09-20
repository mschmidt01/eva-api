const express = require('express');
const Category = require('../models/category');
const MenuItem = require('../models/menuitem')
const app = express();
const AWS = require('aws-sdk');
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const { v4: uuidv4 } = require('uuid');

// The name of the bucket that you have created
const BUCKET_NAME = 'eva-image-b4d1bf14c8';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: 'eu-central-1'
});

app.get('/categories', async (req, res) => {
  const categories = await Category.find({});

  try {
    res.send(categories);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post('/category', async (req, res) => {
  let imageData = req.body.imageData;

  let categoryContent = req.body;
  if(imageData !== null){
    const awsImageKey =  uuidv4();
    categoryContent.awsimagekey = awsImageKey;
    buf = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""),'base64')
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
    categoryContent.image = uploadData.Location;
  }else{
    //TODO Externe IMG-URL saven
  }
  
  delete categoryContent.imageData;

    const category = new Category(categoryContent);

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
          var tmp = await Category.findById(categoryId).exec();
          const awsImageKey = tmp.awsimagekey;
          const category = await Category.findByIdAndDelete(categoryId);
          console.log("cat",category);
          console.log("menu",menuitem);
          if (!category) res.status(404).send("No category found");
          var params = {  Bucket: BUCKET_NAME, Key: awsImageKey };
          s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack);  // error
            else     console.log();                 // deleted
          });
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
      let CategoryContent = req.body;
      let imageData = req.body.imageData;
      console.log(imageData);

      if (imageData !== undefined && imageData !== null){
        var category = await Category.findById(req.params.id).exec();
        console.log(category);
        var awsImageKey = category.awsimagekey;
        var params = {  Bucket: BUCKET_NAME, Key: awsImageKey };
        if (category === null) res.status(404).send("No item found")
        await s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  // error
          else     console.log();                 // deleted
        }).promise();
        awsImageKey =  uuidv4();
        CategoryContent.awsimagekey = awsImageKey;
    
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
        CategoryContent.image = uploadData.Location;
      }
     category =  await Category.findByIdAndUpdate(req.params.id, CategoryContent)
      res.send(category)
    } catch (err) {
      res.status(500).send(err.message)
    }
  })

module.exports = app