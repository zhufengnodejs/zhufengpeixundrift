var async = require('async');//异步操作库
/*
 async.waterfall([function(cb){
 cb(null,'1');
 },function(data,cb){
 cb('2error');
 //cb(null,data+'2');
 },function(data,cb){
 cb(null,data+'3');
 }],function(err,result){
 console.log(err,result);
 });*/
/*
 console.time('cost');
 async.auto({
 select1:function(cb){
 setTimeout(function(){
 console.log('1');
 cb(null,'1');
 },5000);

 },select2:function(cb){
 setTimeout(function(){
 console.log('2');
 cb(null,'2');
 },10000);
 },throwTimes:['select1',function(cb){
 console.log('throwTimes');
 cb(null,'throwTimes');
 }],pickTimes:['select2',function(cb){
 console.log('pickTimes');
 cb(null,'pickTimes');
 }]
 },function(err,results){
 console.timeEnd('cost');
 console.log(results);
 });
 */
async.parallel({
    one:function (cb) {
        cb(null, '1')
    },
    two:function (cb) {
        cb(null, '2')
    }
}, function (err, result) {
    console.log(result);
});

