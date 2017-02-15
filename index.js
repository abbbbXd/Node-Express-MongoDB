var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});//默认布局

//如果环境变量设置了PORT，就用环境变量的PORT，否则就是3000
app.set('port',process.env.PORT || 3000);
//创建视图引擎
app.engine('handlebars',handlebars.engine);
//设置为默认
app.set('view engine','handlebars');
app.use(express.static(__dirname + '/public'));

//检测字符串test=1，用于测试
app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' &&
	req.query.test === '1';
	next();
});

//partials test
function getWeatherData(){
	return{
		locations:[
			{
				name:'Portland',
				forecastUrl:'http://www.wunderground.com/US/PR/Portland.html',
				iconUrl:'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather:'Overcast',
				temp:'54.1f(12.3 C)',
			},
			{
				name:'Manzanita',
				forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl:'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather:'Light Rain',
				temp:'55.0 F(12.8 C)',
			},
			{
				name:'Bend',
				forecastUrl:'http://www.www.wunderground.com/US/OR/Bend.html',
				iconUrl:'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather:'Partly Cloudy',
				temp:'55.0f (12.8 C)',
			},
		],
	};
}

app.use(function(req,res,next){
	if(!res.locals.partials)
		res.locals.partials = {};
	res.locals.partials.weather = getWeatherData();
	next();
});

app.get('/',function(req,res){
	res.render('home');
});

app.get('/about',function(req,res){
	//指定视图用哪个页面测试文件
	res.render('about',{fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate',function(req,res){
	res.render('tours/request-group-rate');
});

// 404页面
app.use(function(req,res){
	res.status(404);	
	res.render('404');
});

// 500页面
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://lcoalhost:'+
		app.get('port')+';press Crtl-C to terminate.');
});