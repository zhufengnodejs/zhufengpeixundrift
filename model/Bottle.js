var redis = require('redis');
var uuid = require('uuid');
var async = require('async');//异步操作库
//通用连接池
var pool = require('generic-pool').Pool({
    name: 'redisPool',
    create: function (callback) {
        callback(null, redis.createClient(6379, '123.57.143.189'));
    },
    destroy: function (client) {
        client.quit();
    },
    max: 100,//最大连接数
    min: 5 //最小连接数
});
module.exports.getTimes = function (username, callback) {
    async.parallel({
        throwTimes: function (cb) {
            pool.acquire(function (err, client) {
                client.SELECT(1, function () {//已扔的次数
                    client.GET(username, function (err, throwTimes) {
                        cb(null, throwTimes);
                    });
                });
            });
        },
        pickTimes: function (cb) {
            pool.acquire(function (err, client) {
                client.SELECT(2, function () {//已扔的次数
                    client.GET(username, function (err, pickTimes) {
                        cb(null, pickTimes);
                    });
                });
            });
        }
    }, function (err, result) {
          callback(null,result);
    });
}
module.exports.throw = function (bottle, callback) {
    var bootleId = uuid.v4();
    var expTime = 3600 * 24;
    pool.acquire(function (err, client) {
        async.waterfall([
            function (cb) {
                client.SELECT(1, function () {//已扔的次数
                    cb(null, 'success');
                });
            },
            function (msg, cb) {
                client.GET(bottle.owner, function (err, result) {
                    if (result && result >= 6) {
                        return cb({code: 0, msg: "今天扔瓶子的机会已经用完了"});
                    } else {
                        cb(null, 'success');
                    }
                });
            },
            function (msg, cb) {
                client.INCR(bottle.username, function () {
                    cb(null, 'success');
                });
            },
            function (msg, cb) {
                client.SELECT(0, function () {//已扔的次数
                    cb(null, 'success');
                });
            }, function (msg, cb) {
                client.HMSET(bootleId, bottle, function (err, result) {
                    if (err) {
                        return cb({code: 0, msg: "没扔成功"});
                    } else {
                        cb(null, 'success');
                    }
                });
            }, function (msg, cb) {
                client.EXPIRE(bootleId, expTime, function () {
                    pool.release(client);
                    cb(null, {code: 1, msg: "瓶子已经飘向远方了"});
                });
            }
        ], function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(result);
            }
        });
    });

}