var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  if(req.params.id == '1'){
    res.render('index', { title: 'Yashod' });
  }else{
    console.error('Invalid ID');
    
  }
});

module.exports = router;
