var express = require('express');
var router = express.Router();
var Bottle = require('../model/Bottle');

router.post('/throw', function(req, res) {
  var bottle = {};
  bottle.owner = req.session.user.username;
  bottle.time = Date.now();
  bottle.content = req.body.content;// content-type application/json
  Bottle.throw(bottle,function(result){
    return res.json(result);
  });
});

module.exports = router;
