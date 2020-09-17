const express = require('express');
const Category = require('../models/category');
const MenuItem = require('../models/menuitem')
const app = express();
const AWS = require('aws-sdk');
const ID = 'AKIAJM3CCPJ325QNJUPQ';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'eva-image-b4d1bf14c8';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
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
    buf = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""),'base64')
    var data = {
      Key: ID,
      Bucket: BUCKET_NAME, 
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };
    let uploadData = s3.upload(data, function(err, data){
        if (err) { 
          console.log(err);
          console.log('Error uploading data: ', data); 
        } else {
          console.log('succesfully uploaded the image!');
          console.log(data);
        }
        
    });
    categoryContent.image = uploadData.Location;
  }else{
    //TODO Externe IMG-URL saven
  }
  
  delete categoryContent.imageData;
  console.log(categoryContent);

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
      //await Category.save()
      res.send(category)
    } catch (err) {
      res.status(500).send(err)
    }
  })

module.exports = app