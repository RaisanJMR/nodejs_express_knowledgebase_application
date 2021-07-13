const express = require('express');
const path = require('path');
// init app
const app = express();

// load view engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug')
// home routes
app.get('/', (req, res) => {
  res.render('index',{heading: 'article', title: 'node_app'});
});

// add route
app.get('/articles/add',(req,res)=>{
  res.render('add',{heading: 'Add Article', title: 'node_app | ADD'});
})

// port
const PORT = 3000;
app.listen(3000, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
