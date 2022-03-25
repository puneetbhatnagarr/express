var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var regModel = require('../modules/reg')
var userModel = require('../modules/category')
var addModel = require('../modules/add')
const multer  = require('multer');
var jwt = require('jsonwebtoken');
var path = require('path'); /*image */

router.use(express.static(__dirname+"./public/")); /*image */
/* image upload ka code */
const Storage = multer.diskStorage({
  destination: './public/upload',
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_" +Date.now()+path.extname(file.originalname));
  }

})  
/*middleware */
var upload = multer({
  storage:Storage
}).single('file')


// local web storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/*middlewares */

/*middleware email check */
function checkemail(req,res,next){
  var e = req.body.email;
  var checkemail = regModel.findOne({
    email:e
  });
  checkemail.exec((err , data )=>{
    if(err) throw err;
    if(data){
      return res.render('form' , {title:'express',msg:'email aleardy exits...'})
    }
    next();
  })
}
function checkeusername(req,res,next){
  var u = req.body.username;
  var checkusername = regModel.findOne({
    username:u
  });
  checkusername.exec((err , data )=>{
    if(err) throw err;
    if(data){
      return res.render('form' , {title:'express',msg:'username aleardy exits'})
    }
    next();
  })
}

/*checking login middleware*/

function CheckLoginUser(req,res,next){
  var UserToken = localStorage.getItem('UserToken')
  try {
    var decoded = jwt.verify(UserToken,'LoginToken');
  }
  catch(err) {
    res.redirect('/');
  }
  next();
}

/* GET home page login. */
router.get('/', function(req, res, next) {
  var LoginUser = localStorage.getItem('LoginUser');
  if(LoginUser){
    res.redirect('/home');
  }
  else{
    res.render('index', { title: 'Express',msg:'' });
  }
  
});

router.post('/', function(req, res, next) {
  var em = req.body.em;
  var pa = req.body.pa;
  const checkUser = regModel.findOne({email:em});


  checkUser.exec((err,data)=>{
    if(data==null){
      res.render('index',  { title: 'Express',msg:'invalid username and password'  });

    }
    else{
      if (err) throw err;
      // console.log(data);
      var getPassword = data.password;
      var getUserId = data._id;
      var username = data.username;
      if(bcrypt.compareSync(pa,getPassword)){
        // create token
        var token = jwt.sign({ User_id: getUserId }, 'LoginToken'); 
        localStorage.setItem('UserToken', token);
        localStorage.setItem('LoginUser',username);
        localStorage.setItem('loginemail',em);
        res.redirect('/home')
      }
      else{
        res.render('index',{title:'express',msg:'invalid username and password'});
      }
      
    }

  });
 
});
/* category route*/
router.get('/home/category', function(req, res, next) {
  res.render('category', { title: 'Express' });
});
router.post('/info',upload,function(req, res, next) {
  if(req.file){
    var imagefile = req.file.filename;
  }
  console.log(req.body)
  var imagefile = req.file.filename;

  var pn = new userModel
  ({
    name:req.body.na,
    
    image:imagefile
  });
  //  console.log(pn);
  pn.save(function(){
  userModel.find({},function(err,data){
    if(err) throw err
  res.render('category', {title : 'express', records: data});
  });
})

});

/* password details*/
router.get('/password_detail', function(req, res, next) {
  userModel.find({},function(err,data){
    if(err) throw err
  res.render('password_detail', {title : 'express', records: data});
  
  });
});

  router.post('/pass', function(req, res, next) {
   
    var t1 = new addModel({
      name:req.body.na,
      project:req.body.pro,
      details:req.body.details,
    
  
    });
    // console.log(t)
    t1.save(function(){
      userModel.find({},function(err,data){
        if(err) throw err
      res.render('password_detail', {title : 'express', records: data});
      });
    })
    
    });
  
  
/*password view */
router.get('/passview', function(req, res, next) {
  addModel.find({},function(err,data){
    if(err) throw err
    res.render('passview', {title : 'express', records: data});
  });
})


/*dispaly view */
router.get('/display', function(req, res, next) {
  userModel.find({},function(err,data){
    if(err) throw err
    res.render('display', {title : 'express', records: data});
  });
})

/*edit */
router.get('/edit/:id', function(req, res, next) {
  var id= req.params.id;
  // console.log(id);
  var edit = userModel.findById(id);
  // console.log(editdata) 
  edit.exec(function(err ,data){
    // console.log(data)
    if(err) throw err;
    res.render('edit', { title: 'Express' , records: data});
  });

});

// Update
router.post('/update',upload, function(req, res, next) {
  if(req.file){
    var imagefile = req.file.filename;
  }
  
  for(var educations in req.body.edu){
    // console.log(edu);
    if(req.body.edu){
      items = req.body.edu;
      educations = JSON.stringify(items).replace(/]|[[]|"/g, '',);
      
    }
  }
  
  var inf =  userModel.findByIdAndUpdate(req.body.id ,{
    name:req.body.na,
  
    image:imagefile



  });
  // console.log(t)
  inf.exec(function (err , data){
    if(err) throw err;
    userModel.find({},function(err,data){
      // console.log(data);
      if(err) throw console.error;
    res.render('display', { title: 'Express', records:data });
    
  })

});
});


 /* delete */
router.get('/delete/:id', function(req, res, next) {
  var id= req.params.id;
  
  var del = userModel.findByIdAndDelete(id);
  
  del.exec(function(err ,data){
    // console.log(data)
    userModel.find({},function(err,data){
    if(err) throw err;
    res.render('display', { title: 'Express' , records: data});
  })
  });

});
/* form*/
router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Express' ,msg:'' });
});

router.post('/store',checkemail,checkeusername,function(req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  if(password != cpassword){
    res.render('form',{title:'express',msg:'password not matched'});
  }
  else{
    password = bcrypt.hashSync(req.body.password,10);
  var f = new regModel({
    username:username,
    email:email,
    password:password,
    cpassword:cpassword,
    
  });
  console.log(f);
  f.save(function(){
    regModel.find({},function(err ,data){
      if(err) throw err
      res.render('form',{title:'express',msg:''});
    })
  })
}
});


/*home*/
router.get('/home',CheckLoginUser, function(req, res, next) {
  var  username = localStorage.getItem('LoginUser')
  res.render('home', { title: 'Express' ,username:username });
  });
/* logout*/
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('UserToken');
  localStorage.removeItem('LoginUser');
  res.redirect('/');
});


  
module.exports = router;