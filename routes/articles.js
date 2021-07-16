const express = require('express');

const router = express.Router();

// Bring in Article models
let Article = require('../models/article');
// Bring in User models
let User = require('../models/user');

// add route
router.get('/add', ensureAuthenticated, function (req, res) {
  res.render('add_article', {
    heading: 'Add Article',
    title: 'knowledgeBase | ADD ARTICLE',
  });
});

// add submit POST route
router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
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
    article.author = req.user._id;
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
// router.get('/edit/:id', ensureAuthenticated, function (req, res) {
//   Article.findById(req.params.id, function (err, article) {
//     if (article.author != req.user._id) {
//       req.flash('danger', 'not Authorized');
//       res.redirect('/');
//     }
//     res.render('edit_article', {
//       heading: 'Edit article',
//       article: article,
//       // title: `knowledgeBase | edit ${article.title}`,
//     });
//   });
// });


// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });

  } catch (e) {
    res.send(e);
  }

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
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };
  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.deleteOne(query, (err) => {
        if (err) {
          console.log(err);
        }
        res.send('sucess');
      });
    }
  });
});

//  routes with place holder should be place below when creating seprate routes
// get single route
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (req, user) => {
      res.render('article', {
        article: article,
        author: user.name,
        title: `knowle dgeBase | ${article.title}`,
      });
    });
  });
});

// Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
