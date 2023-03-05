const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //to store static files
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB',{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
}
const Article=mongoose.model("Article",articleSchema);
//-------------------request targeting all atricles------------------------//
app.route("/articles")  //chained route handlers
.get(function(req,res){
 Article.find({},function(err,foundArticles){
   //console.log(foundArticles);
   if(!err){
    res.send(foundArticles);
   }
   else{
    res.send(err);
   }
   
 })
})
.post(function(req,res){
   //console.log(req.body.title);
    //console.log(req.body.content);
    const newArticle=new Article({
      title:req.body.title,
      content:req.body.content  
    });
    newArticle.save(function(err){
      if(!err){
        res.send("sucessfully added new article");
      } 
      else{
        res.send(err);
      } 
    });
})
.delete(function(req,res){
 Article.deleteMany({},function(err){
   if(!err){
    res.send("sucessfully deleted all articles");
   }
   else{
    res.send(err);
   }
 });
});

//app.get("/articles",);
//app.post("/articles",);
//app.delete("/articles",);
//-----------------------request targeting specific articles--------------------//

app.route("/articles/:articleTitle")
.get(function(req,res){
  
  Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("no article matches with that title");
    }
  });
})
.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    
    function(err){
     if(!err){
      res.send("sucessfully updated articles");
     }
      else{
        res.send("err");
      }
    }
  );
})
.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("sucessfully updates articles");
      }
      else{
        res.send(err);
      }
    }


  );
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("sucessfully deleted a corresponding specific article");
      }
      else{
        res.send(err);
      }
    }
  );
});





app.listen(3000,function(){
  console.log("server is running on port 3000"); 
});