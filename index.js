
//Boiler Plate Code for setting up the server
//Including the app.listen() function
//******************************************************************************************************************//
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//******************************************************************************************************************//
//Connecting to our database on mongoDB
const password = encodeURIComponent("Gtalebron@23")
const uri = `mongodb+srv://bamMongo23:${password}@cluster0.wvbvubq.mongodb.net/restfulAPI`;
mongoose.connect(uri, { useNewUrlParser: true})

//Creating the Schema for the articles
const articleSchema = {
  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  }
}

//Creating the model
const Article = new mongoose.model("Article", articleSchema)
//****************************************** Request Targeting All Articles ************************************************************************//

//Using chained route handler to chain route methods

app.route("/articles")
.get(function(req,res){
  Article.find(function(err,allArticles){
    if(err){
      res.send(err )
    }
    else{
      res.send(allArticles)
    }
  })
})
.post(function(req,res){

  const newArticle = new Article({
    title:req.body.title,
    content: req.body.content
  })
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added new article")
    }
    else{
      res.send(err)
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err){
      res.send(err)
    }
    else{
      res.send("Successfully Deleted All Articles")
    }
  })
});
//**************************************************** Request Targeting Specific Article **************************************************************//


app.route("/articles/:articleName")
.get(function(req,res){
  Article.find({title: req.params.articleName},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }
    else{
      res.send("No Article Found")
    }
  })
})
.put(function(req,res){
  Article.findOneAndUpdate(
    {title: req.params.articleName},
    {title: req.body.title, content: req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully Updated Field")
      }
      else{
        res.send(err)
      }
  })
})
.patch(function(req,res){
  Article.findOneAndUpdate(
    {title: req.params.articleName},
    {$set: req.body},
    function(err){
        if(!err){
          res.send("Successfully Updated");
        }
        else{
          res.send(err)
        }
    })
})
.delete(function(req,res){
  Article.findOneAndDelete({title: req.params.articleName},function(err){
    if(!err){
      res.send("Successfully Deleted Article")
    }
    else{
      res.send(err)
    }
  })
})
//******************************************************************************************************************//
app.listen(3000, function(){
  console.log("Server is up and running");
})
