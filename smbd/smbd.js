var fs = require('fs');

function getCurrentPath() {
	var currentPath = process.argv[1].split('\\');
	currentPath.pop();
	currentPath.push('db');
	return currentPath.join('\\');
}

exports.getList = (callback) => {
	fs.readdir(getCurrentPath(), (err, files) => {
		if (err) throw err;
		if (files.length) {
			for (var i = 0; i < files.length; i++) {
				files[i] = +files[i].substring(0, files[i].indexOf('.'));
			}
			files.sort((a, b) => {
				if (a > b) return 1;
				if (a < b) return -1;
			});
			callback(err, files);
		}
	});
}

function getFreeId(callback) {
	var result;
	fs.readdir(getCurrentPath(), (err, files) => {
		if (err) throw err;
		console.log(files);
		if (files.length) {
			for (var i = 0; i < files.length; i++) {
				files[i] = +files[i].substring(0, files[i].indexOf('.'));
			}
			files.sort((a, b) => {
				if (a > b) return 1;
				if (a < b) return -1;
			});
			result = files[(files.length - 1)] + 1;
			callback(null, result);
		}
		else callback(null, 1);
	});
}

exports.write = (object, db, callback) => {
	var strJson = JSON.stringify(object);
	getFreeId((err, id) => {
		if (err) throw err;
		fs.writeFile(`${getCurrentPath()}/${db}/${id}.json`, strJson, (err) => {
			if (err) throw err;
			console.log(`${getCurrentPath()}${id}.json`);
			console.log('written');
			callback(err, id);
		});
	});
}

exports.delete = (id, db, callback) => {
	fs.unlink(`${getCurrentPath()}/${db}/${id}.json`, (err) => {
		if (err) throw err;
		console.log(`deleted`)
		callback(err, id);
	})
}

exports.read = (id, db, callback) => {
	fs.readFile(`${getCurrentPath()}/${db}/${id}.json`, 'utf8', (err, data) => {
		if (err) throw err;
		var result = JSON.parse(data);
		callback(err, data);
	})
}