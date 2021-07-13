const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

// Check connection
db.once('open', function () {
  console.log('connected to mongoDB');
});

// Check for database errors
db.on('error', function (err) {
  console.log(err);
});

// init app
const app = express();


// MIDDLEWARE
// bodyparser allows us to take incoming post request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Bring in database models
let Article = require('./models/article');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home routes
app.get('/', (req, res) => {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        heading: 'article',
        title: 'node_app',
        articles: articles,
      });
    }
  });
});

// add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    heading: 'Add Article',
    title: 'node_app | ADD',
  });
});

// add submit POST route
app.post('/articles/add', (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err)=>{
    if(err) {
      console.log(err)
    }else {
      res.redirect('/')
    }
  })
  
});
// port
const PORT = 3000;
app.listen(3000, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
