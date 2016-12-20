var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var crypto = require('crypto');

app.use(express.static(path.join(__dirname, 'public')));
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
app.get('/index',function(req ,res ){
	res.sendFile(__dirname+'/public/index.html');
});
app.get('/google',function(req ,res ){
	res.redirect('http://google.com');
})

//在express中实现会话验证

function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

app.use(cookieParser('MAGICString'));
app.use(session());
app.use(bodyParser());
app.get('/restricted' , function(req ,res ){
	if(req.session.user){
		res.send('<h2>'+ req.session.success + '</h2>' + 
				'<p>You have entered the restriced section</p><br>' +
				'<a href = "../logout.html">logout</a>');
	}else{
		req.session.error = "Access denied!";
		res.redirect('/login');
	}
});
app.get('/logout' ,function(req ,res ){
	req.session.destory(function () {
		res.redirect('/public/login.html');
	});
});

app.get('/login' ,function (req ,res){
	res.sendFile(__dirname + '/public/login.html');
	if(req.session.user){
		res.redirect('/restricted');
	}else if(req.session.error){
		console.log('res.session.error');
	}
});

app.post('/login' ,function (req ,res ){
	console.log(req.body);
	var user = {
		name : req.body.username,
		password : hashPW("myPass")
	}
	if(user.password === hashPW(req.body.password.toString())){
		req.session.regenerate(function(){
			req.session.user = user;
			req.session.success = "Authenticated as "+ user.name;
			res.redirect('/restricted');
		})
	}else{
		req.session.regenerate(function(){
			req.session.error = "Authentication failed.";console.log(req.session.error);
			res.redirect('/restricted');
		});
		// res.redirect('/login');
		
	}
});
