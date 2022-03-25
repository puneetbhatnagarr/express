const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/curd');
var con=mongoose.connection;

// SCHEMA 
const regSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,

    
});
// createing model 

var regModel = mongoose.model('projectform',regSchema);  //employess collections ka naam hai 

module.exports = regModel

