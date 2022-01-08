

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");


const homeStartingContent = "";
const aboutContent = "Hey Everyone, I am Guneet Singh, currently I am pursuing my Bachelor of Technology from Guru Tegh Bahadur Institute of Technology, Welcome to my Blog Website, here I post my Latest Projects as well as new ideas that I am working on.";
const contactContent = "If you have any queries or any kind of message/feedback feel free to contact me via the form provided below, I will try my best to respond at the earliest.";

const app = express();

mongoose.connect("mongodb+srv://admin:admin@prometheus.clfqo.mongodb.net/blogDB",{useNewUrlParser:true});

const postSchema = {
  title : String,
  content : String,
  link : String 
}

const Post = mongoose.model("Post",postSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/posts/:postId",function(req,res){

  const postId = req.params.postId;

  Post.findOne({_id:postId},function(err,result){
    if(err){
      res.send(err);
    }else{
    res.render("post",{post : result});
    }
  });
   
});
app.post("/posts/:postId",function(req,res){

  const postId = req.params.postId;
  const delCheck = _.lowerCase(req.body.delCheck);

  if(delCheck == 'delete'){
    Post.deleteOne({_id:postId},function(err,result){
      res.redirect("/");
    });
  }else{

    Post.findOne({_id:postId},function(err,result){
      res.render("post",{post : result});
  
    });
  }
   
});

app.get("/update/:postId",function(req,res){

  const postId = req.params.postId;

  Post.findOne({_id:postId},function(err,result){
    res.render("update",{post : result});

  });
   
});
app.post("/update/:postId",function(req,res){

  const postId = req.params.postId;

  Post.findOneAndUpdate({_id:postId},{ $set: { "title" : req.body.newTitle ,"content" : req.body.newContent, "link" : req.body.newLink} }).exec(function(err, book){
    if(!err){
      res.redirect("/");
    }
  });
    
   
});
app.get("/",function(req,res){

  Post.find({},function(err,posts){
    if(!err){
      res.render("home",{homeContent : homeStartingContent, post : posts});
    }
  })
  
});
app.get("/about",function(req,res){
  res.render("about",{about : aboutContent});

});
app.get("/contact",function(req,res){
  res.render("contact",{contact : contactContent});

});

app.get("/compose",function(req,res){
  res.render("compose");

});
app.post("/compose",function(req,res){
  
  const newPost = new Post({
    title : req.body.newTitle,
    content : req.body.newPost,
    link : req.body.newLink
  })

  newPost.save();
  res.redirect("/");
});




app.listen(6900, function() {
  console.log("Welcome to 69");
});
