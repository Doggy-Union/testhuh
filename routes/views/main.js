var keystone = require('keystone');
var PortfolioWork = keystone.list('PortfolioWork');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	view.on('init', function(next) {
		var q = PortfolioWork.model.find().limit(5).select('title preview link').exec(function(err, res) {
			locals.res = [];
			locals.res = res;
			console.log(locals.res);
			next();
		});
	});
	
	view.render('main');
}