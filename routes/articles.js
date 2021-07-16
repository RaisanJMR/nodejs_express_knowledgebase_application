const express = require('express');

const router = express.Router();

// Bring in Article models
let Article = require('../models/article');

// add route
router.get('/add', (req, res) => {
  res.render('add_article', {
    heading: 'Add Article',
    title: 'knowledgeBase | ADD ARTICLE',
  });
});

// add submit POST route
router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // get error
  let errors = req.validationErrors();
  if (errors) {
    res.render('add_article', {
      heading: 'Add Article',
      errors: errors,
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Article added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
      article: article,
      heading: 'Edit article',
      title: `knowledgeBase | edit ${article.title}`,
    });
  });
});

// edit submit POST route
router.post('/edit/:id', (req, res) => {
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
      req.flash('success', 'Article updated');
      res.redirect('/');
    }
  });
});

// DELETE request
router.delete('/:id', (req, res) => {
  let query = { _id: req.params.id };
  Article.deleteOne(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('sucess');
  });
});

//  routes with place holder should be place below when creating seprate routes
// get single route
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article,
      title: `knowledgeBase | ${article.title}`,
    });
  });
});
module.exports = router;
