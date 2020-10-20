const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const fileUpload = require("express-fileupload");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

//middle wars
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use(express.static("service"));

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4pds.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  //db collections
  const addServiceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("addServiceCollection");
  //admin emails collection
  const adminsEmailCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admins");
  //orders collection
  const orderInfoCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("order");
  console.log("database connected");
  //review collection
  const reviewCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("review");
  console.log("database connected");

  app.post("/uploadImg", (req, res) => {
    const file = req.files.file;
    file.mv(`${__dirname}/service/${file.name}`, (err) => {
      res.send("file not found");
    });
  });

  app.post("/addServiceInfo", (req, res) => {
    addServiceCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      // console.log(result.insertedCount);
    });
  });
  app.post("/orderInfo", (req, res) => {
    orderInfoCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      // console.log(result.insertedCount);
    });
  });

  app.post("/admins", (req, res) => {
    adminsEmailCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });

  app.post("/addReview", (req, res) => {
    reviewCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });

  //get
  app.get("/gettingAddService", (req, res) => {
    addServiceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/admins", (req, res) => {
    adminsEmailCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      // console.log(documents);
    });
  });
  app.get("/orderInfo", (req, res) => {
    orderInfoCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      // console.log(documents);
    });
  });

  app.get("/orderReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(documents);
    });
  });

  //update
  app.patch("/updateStatus/:id", (req, res) => {
    console.log(req.params.id);
    orderInfoCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  //
});

app.get("/", (req, res) => {
  res.send("Hello Mr. Rabby Welcome in your Creative agency server");
});

// 315201026@hamdarduniversity.edu.bd
// 315201026@hamdarduniversity.edu.bd

app.listen(port);
