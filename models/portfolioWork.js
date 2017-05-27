var keystone = require('keystone');
var Types = keystone.Field.Types;

var PortfolioWork = new keystone.List('PortfolioWork', {
	autokey: { from: 'preview', path: 'key', unique: true }
});

PortfolioWork.add({
    title: { type: String, required: true, initial: true },
    preview: { type: Types.Url, required: true, initial: true },
	description: { type: String },
	link: { type: Types.Url, required: true, initial: true }
});

PortfolioWork.register();