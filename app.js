const express = require('express');
const path = require('path');
// init app
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// home routes
app.get('/', (req, res) => {
  let articles = [
    {
      id: 1,
      title: 'Article one',
      author: 'Author one',
      aticle: 'this is article one',
    },
    {
      id: 2,
      title: 'Article two',
      author: 'Author two',
      aticle: 'this is article two',
    },
    {
      id: 3,
      title: 'Article three',
      author: 'Author three',
      aticle: 'this is article three',
    },
  ];
  res.render('index', { heading: 'article', title: 'node_app', articles: articles});
});

// add route
app.get('/articles/add', (req, res) => {
  res.render('add_article ', {
    heading: 'Add Article',
    title: 'node_app | ADD',
  });
});

// port
const PORT = 3000;
app.listen(3000, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
