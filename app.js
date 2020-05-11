var express         = require('express');
var app             = express();
var request         = require('request');
var bodyParser      = require("body-parser");
var mongoose        = require('mongoose');
var methodOverride  = require('method-override')

// Mongoose:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
mongoose.connect('mongodb://localhost/blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created:
   {
    type: Date, default: Date.now
  }
})

var Blog = new mongoose.model("Blog", blogSchema)

// Blog.create


//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({extended:true}));
  app.set("view engine", "ejs");
  app.use(methodOverride("_method"))
  
// ROUTES:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get('/', function(req, res){
  res.redirect('blogs');
});

app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
      if(err){
        console.log("error");
      }else {
        res.render("index", {blogs: blogs})
      }
    })
});
app.get('/blogs/new', function(req, res){
  res.render('new');
});

//  POST ROUTEs:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
app.post("/blogs", function(req, res){
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs")
    }
  })
})
 
// SHOW ROUTE:
// ~~~~~~~~~~~~~~~~~~~~
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs")
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});
// EDIT ROUTE:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get("/blogs/:id/edit", function(req, res){
Blog.findById(req.params.id, function(err, foundBlog){
  if(err){
    res.redirect("/blogs")
  } else {
    res.render("edit", {blog: foundBlog});
  }
});
  });

  // UPDATE ROUTE:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
      if(err){
        res.redirect("/blogs")
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    })
  })





  // PORT LISTENING:
app.listen(3000, () => console.log('server connected'));