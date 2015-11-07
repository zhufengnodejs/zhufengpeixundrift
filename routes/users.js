var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var uuid = require('uuid');
var path = require('path');
var fs = require('fs');
// post /users/add
router.post('/add', function(req, res) {
  new formidable.IncomingForm().parse(req,function(err,fileds,files){
    var username = fileds.username;
    var avatar = files.avatar;
    if(!username){
      return res.json({code:0,msg:"用户名不能为空"});
    }
    var avatarName = uuid.v4()+path.extname(files.avatar.name);
    fs.createReadStream(files.avatar.path).pipe(fs.createWriteStream('../public/upload/'+avatarName));
    req.session.user = {
      username:username,
      avatar:'/upload/'+avatarName,
      throwTimes:0,
      pickTimes:0
    }
    return res.json({code:1,msg:req.session.user});
  });
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  return res.json({code:1,msg:'退出成功'});
});
module.exports = router;
