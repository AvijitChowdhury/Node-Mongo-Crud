
const express = require('express');
const bodyParser = require('body-parser');


const password = '1234';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { application } = require('express');
const uri = "mongodb+srv://organicUser:1234@cluster0.rrrzb.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
    //res.send('hello im working');
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const collection = client.db("organicdb").collection("products");
  // perform actions on the collection object
  //read
    app.get('/product',(req,res)=>{
        collection.find({}).limit(6)
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })


  //collection.insertOne({name:'modhu',price:25,quantity:20}).then(res=>console.log('one product added'))
  //create 
  app.post('/addProduct',(req,res)=>{
      const product = req.body;
      //console.log(product);
      collection.insertOne(product).then(result=>{
          console.log('data Added succesfully');
          //res.send('success');
          res.redirect('/');
        });
     
  })
  console.log('databaseConnected');
 // client.close();
      app.delete('/delete/:id',(req,res)=>{
        console.log(req.params.id);
        collection.deleteOne({_id:ObjectId(req.params.id)})
        .then((result)=>{
          console.log(result);
          res.send(result.deletedCount>0);
        })
      })
      //update product
      app.get('/product/:id',(req,res)=>{
        collection.find({_id:ObjectId(req.params.id)})
        .toArray((err,documents)=>{
          res.send(documents[0]);
        })
      })
      app.patch('/update/:id',(req,res)=>{
        console.log(req.body.price);
        collection.updateOne({_id:ObjectId(req.params.id)},{
          $set:{price:req.body.price,quantity:req.body.quantity}
        }).then(result=>{
          res.send(result.modifiedCount>0);
          console.log(result);})
      })
});



app.listen(3000);