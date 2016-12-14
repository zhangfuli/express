var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
//监听服务端口
app.listen(8080,function(){
	console.log('started');
});
app.get('/',function(req,res){
	res.send("hello world");
});
app.get('/find', function(req ,res ){
	console.log(req);   
	var query = req.query;
	res.send('Finding Book: Author :'+query.author+
			'Title :' + query.title );
});
//运用正则匹配
app.get(/^\/book\/(\w+)\:(\w+)?$/,function(req ,res){
	console.log(req);
	res.send('Get book: Chaper : '+ req.params[0]+
		'Page : '+ req.params[1]);
});
app.get('/user/:userid' , function (req ,res){
	console.log(req);
	res.send("Get user :" +req.params['userid']);
});
app.get('/error',function(req ,res ){
	res.status(400);
	res.send('This is a bad request.');
});