require("dotenv").config();

const express=require("express");

const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")//require encrypt pwd.
//const md5=require("md5");//require hash md5
//const bcrypt=require("bcrypt");
//const saltRounds = 10; BCRYPT
var session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

const app=express();
//console.log(md5("123456"))
console.log(process.env.API_KEY);//to fetch API_KEY from touch.env
app.use(express.static("public"));
app.set('view engine','ejs');
//app.use(bodyParser,urlencoded({
    //extended:true
//}));
app.use(express.urlencoded({ extended: true }))
app.use(session({  //for creating session
    secret:"Our little secrete.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());//to deal with session
mongoose.connect("mongodb://localhost:27017/userDB")
//{userNewUrlParse:true})//connection to mongodb
//mongoose.set("useCreateIndex",true);
const userSchema=new mongoose.Schema({//code for encrypt decrypt
    email:String,
    password:String
});
userSchema.plugin(passportLocalMongoose);

//const secret="This is my secrete";


userSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:["password"]});//encryptedFields:["password"] used to encrypt specific feilds.
const User=new mongoose.model("User",userSchema);//create collection
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){ //to push data into User in mongodb
    /*bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new User({
            email:req.body.username,
            password:hash*/
        
        
    
    const newUser=new User({
        email:req.body.username,
        password:req.body.passworrd
        //password:md5(req.body.password)//to hash  md5 the password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})

app.post("/login",function(req,res){
    const username=req.body.username;
    //const password=md5(req.body.password); //this is for md5
    const password=req.body.password;

    User.findOne({email: username},function(err,foundUser){//to fetch data while login
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){ //this is for md5 code.
                /*bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result == true)
                    res.render("secrets");
                });*/
                
                    res.render("secrets");
                    //res.render("secrets"); for md5 before code

                }

            }
        }
    }
)});

app.listen(3000,function(){
    console.log("Server listening on PORT 3000");
});

