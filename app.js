var express = require('express');
var routes = require('./routes');
var http = require('http');
var ejs = require('ejs');
var path = require('path');

var app = express();
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

server.listen(5566, function(){
  console.log('listening on 5566');
});


// 模拟异常
//setTimeout(function(){
//  console.log(new Date());
//  throw new Error('App is error from inner!');
//},5*1000);
