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

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

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
        heading: 'Articles',
        title: 'knowledgeBase | HOME',
        articles: articles,
      });
    }
  });
});

// get single route
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article,
      title: `knowledgeBase | ${article.title}`,
    });
  });
});

// add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    heading: 'Add Article',
    title: 'knowledgeBase | ADD ARTICLE',
  });
});

// add submit POST route
app.post('/articles/add', (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});



// load edit form
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
      article: article,
      heading: 'Edit article',
      title: `knowledgeBase | edit ${article.title}`,
    });
  });
});



// edit submit POST route
app.post('/articles/edit/:id', (req, res) => {
  let article = {};
  let query = { _id: req.params.id };
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  Article.updateOne(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});



// DELETE request
app.delete('/article/:id', (req, res) => {
  let query = { _id: req.params.id };
  Article.deleteOne(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('sucess');
  });
});



// port
const PORT = 3000;
app.listen(3000, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
