'use strict';

const htr = require('./html_replacer.js');
const fs = require('fs');
const smbd = require('./smbd/smbd.js');
const url = require('url');
const http = require('http');
const server_port = (process.env.OPENSHIFT_NODEJS_PORT || 8080);
const server_ip_address = (process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
const zlib = require('zlib');
const gzip = zlib.createGzip();
const etag = require('etag');
var root_path = process.argv[1].split('/');
root_path.pop();
root_path = root_path.join('/');

http.createServer((req, res) => {
	var parsedUrl = url.parse(req.url, true);
	if (!(parsedUrl.pathname.indexOf('.') + 1)) { // This way if request url doesn't content a dot
		if (parsedUrl.pathname == '/') {
			fs.readFile(`${root_path}/public/index.html`, 'utf8', (err, data) => {
				if (!(req.headers['if-none-match'] == `${etag(data, {weak: true})}`)) {
					res.writeHead(200, {'Content-Type': 'text/html', 'ETag': `${etag(data, {weak: true})}`});
					res.write(data);
					res.end();
				}
				else {
					res.statusCode = 304;
					console.log("HTML isn't modified (test of tail)")
					res.end();
				}
			});
		}
		else {
			fs.stat(`${root_path}/${parsedUrl.pathname}`, (err, stats) => {
				if (!err) {
					if (stats.isFile()) {
						var dynContent;
						fs.readFile(`${root_path}/public/${parsedUrl.pathname}.html`, 'utf8', (err, html) => {
							smbd.getList((err, files) => {
								if (err) throw err;
								for (let i = 0; i < files.length; i++) {
									smbd.read(files[i], parsedUrl.pathname.substring(1, parsedUrl.pathname.length), (err, data) => {
										if (err) throw err;
										htr.replace(template, data, '$$$REPLACE$$$', (err, result) => { // need to enter a template here (TODO)
											if (err) throw err;
											dynContent += result;
										});
									});
								}
								htr.replace(html, dynContent, '$$$REPLACE$$$', (err, result) => {
									if (err) throw err;
									res.write(result);
									res.writeHead(200, {'Content-Type': 'text/html', 'ETag': `${etag(data, {weak: true})}`});
									res.end();
								});
							});
						});
					}
					else {
						fs.readFile(`${root_path}/public/${parsedUrl.pathname}.html`, 'utf8', (err, html) => {
							res.writeHead(200, {'Content-Type': 'text/html', 'ETag': `${etag(data, {weak: true})}`});
							res.write(html);
							res.end();
						});
					}
				}

				else {
					if (err.code == 'ENOENT') {
						res.statusCode = 404;
						res.end('404 Not Found');
					}
					else {
						throw err;
					}
				}
			});
		}
	}

	else {
		var extension = parsedUrl.pathname.substring(parsedUrl.pathname.indexOf('.'), parsedUrl.pathname.length);
		if (extension == '.css') {
			fs.readFile(`${root_path}/public/${parsedUrl.pathname}`, 'utf8', (err, css) => {
				if (!err) {
					if (!(req.headers['if-none-match'] == `${etag(css, {weak: true})}`)) {
						var now = new Date();
						now.setDate(now.getDate() + 7);
						res.writeHead(200, {'Content-Type': 'text/css', 'Expires': now.toUTCString(), 'Cache-Control': 'max-age=604800', 'ETag': `${etag(css, {weak: true})}`});
						res.write(css);
						res.end();
					}
					else {
						res.statusCode = 304;
						res.end();
					}
				}

				else {
					if (err.code == 'ENOENT') {
						res.statusCode = 404;
						res.end('404 Not Found');
					}
					else {
						throw err;
					}
				}
			});
		}

		if (extension == '.jpg' || extension == '.jpeg' || extension == '.png' || extension == '.gif') {
			fs.readFile(`${root_path}/public/images/${parsedUrl.pathname}`, (err, img) => {
				if (!err) {
					if (!(req.headers['if-none-match'] == `${etag(img, {weak: true})}`)) {
						var now = new Date();
						now.setDate(now.getDate() + 7);
						res.writeHead(200, {'Content-Type': `image/${extension.substring(1)}`, 'Expires': now.toUTCString(), 'Cache-Control': 'max-age=604800', 'ETag': `${etag(img, {weak: true})}`});
						res.write(img);
						res.end();
					}
					else {
						res.statusCode = 304;
						res.end();
					}
				}

				else {
					if (err.code == 'ENOENT') {
						res.statusCode = 404;
						res.end('404 Not Found');
					}
					else {
						throw err;
					}
				}
			});
		}

		if (extension == '.ttf' || extension == '.otf') {
			var now = new Date();
			now.setDate(now.getDate() + 7);
			res.writeHead(200, {'Content-Type': 'application/octet-stream', 'Expires': now.toUTCString(), 'Cache-Control': 'max-age=31536000', 'Content-Encoding': 'gzip'});
			fs.readFile(`${root_path}/public/fonts/${parsedUrl.pathname}`, (err, data) => {
				if (err) throw err;
				zlib.gzip(data, (err, buffer) => {
					if (!err) {
						res.end(buffer);
					} else {
						console.log(err);
					}
				});
			});
		}

		if (extension == '.js') {
			fs.readFile(`${root_path}/public/${parsedUrl.pathname}`, 'utf8', (err, js) => {
				if (!err) {
					if (!(req.headers['if-none-match'] == `${etag(js, {weak: true})}`)) {
						var now = new Date();
						now.setDate(now.getDate() + 7);
						res.writeHead(200, {'Content-Type': 'text/js', 'Expires': now.toUTCString(), 'Cache-Control': 'max-age=604800', 'ETag': `${etag(js, {weak: true})}`});
						res.write(js);
						res.end();
					}
					else {
						res.statusCode = 304;
						res.end();
					}
				}

				else {
					if (err.code == 'ENOENT') {
						res.statusCode = 404;
						res.end('404 Not Found');
					}
					else {
						throw err;
					}
				}
			});
		}
	}
}).listen(server_port, server_ip_address);