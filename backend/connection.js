const mongoose = require('mongoose');

const url = "mongodb+srv://singhrajputjyotiraditya:j921za55j@cluster0.rkmxp.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url)
  .then((result) => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;