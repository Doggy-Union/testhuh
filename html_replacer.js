exports.replace = (template, data, replacePhrase, callback) => {
	var beginChar = template.indexOf(replacePhrase);
	var result = template.substring(0, beginChar) + data + template.substring(beginChar + replacePhrase.length, template.length);
	callback(null, result);
}