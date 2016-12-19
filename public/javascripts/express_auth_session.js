var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
var crypto = require('crypto');


function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

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
