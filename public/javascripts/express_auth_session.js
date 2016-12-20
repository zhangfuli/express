var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var crypto = require('crypto');
var path = require('path');

function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser);
app.use(cookieParser('MAGICString'));
app.use(session());
app.get('/restricted' , function(req ,res ){
	if(req.session.user){
		res.send('<h2>'+ req.session.success + '</h2>' + 
				'<p>You have entered the restriced section</p><br>' +
				'<a href = "../logout.html">logout</a>');
	}else{
		req.session.error = "Access denied!";
		res.redirect('../login.html');
	}
});
app.get('/logout' ,function(req ,res ){
	req.session.destory(function () {
		res.redirect('../login.html');
	});
});

app.get('/login' ,function (){
	res.sendFile(__dirname + '/public/login.html');
	if(req.session.user){
		res.redirect('/restricted.html');
	}else if(req.session.error){
		console.log('res.session.error');
	}
});

app.post('/login.html' ,function (req ,res ){
	var user = {
		name : res.session.username,
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
			req.session.error = "Authentication failed.";
			res.redirect('/restricted');
		});
		res.redirect('/login');
	}
});

app.listen(9000);