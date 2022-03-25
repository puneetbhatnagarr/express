const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/curd');
var con=mongoose.connection;


// SCHEMA 

const addSchema=new mongoose.Schema({
    
    name:String,
    
    project:String,
    details:String
    

    
});


// createing model 

var addModel = mongoose.model('add_details',addSchema);  

module.exports = addModel











