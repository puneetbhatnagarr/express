const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/curd');
var con=mongoose.connection;


// SCHEMA 

const userSchema=new mongoose.Schema({
    
    name:String,
    image:String,
    
    

    
});


// createing model 

var userModel = mongoose.model('userpro',userSchema);  //employess collections ka naam hai 

module.exports = userModel











