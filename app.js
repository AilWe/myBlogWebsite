//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');

 const homeStartingContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ailin:<Pw>!@cluster0.sk1ge.mongodb.net/blogWebsiteDB");

const blogSchema = {
  blogTitle: String,
  blogContent: String
};

const Blog = mongoose.model("Blog", blogSchema);


app.get('/', function (req, res){
  Blog.find({}, function (err, foundBlogs){
      res.render("home", {headContent: homeStartingContent, posts: foundBlogs});
    }
   );
})
app.get('/contact', function (req, res){
  res.render("contact", {contactContent: contactContent});
})
app.get('/about', function (req, res){
  res.render("about", {aboutContent: aboutContent});
})
app.get('/compose', function (req, res){
  res.render("compose");
})
app.get('/posts/:postTitle', function (req, res){
  const requestTitle = req.params.postTitle;
  //console.log(requestTitle);
  Blog.findOne({blogTitle: requestTitle}, function (err, foundPost){
    res.render("post", {title: foundPost.blogTitle, content: foundPost.blogContent});
  });

})

app.post("/compose", function (req, res){
  const newPost = new Blog({
    blogTitle: req.body.newPostTitle,
    blogContent: req.body.newComposeContent
  });

  Blog.findOne({blogTitle: newPost.blogTitle}, function(err, foundBlog){
    if(!foundBlog){
      if(newPost.blogTitle && newPost.blogContent) {
        newPost.save();
        res.redirect("/");
      }
      else{
        setTimeout(() => {res.redirect("/")}, 1000);
      }
    }
    else
      res.redirect("/");
  });
  // console.log(newPost);
})
app.post("/composeredirect", function(req, res){
  const postRedirect = req.body.postRedirect;
  // console.log(postRedirect);
  if(postRedirect){
    res.redirect("/compose");
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
