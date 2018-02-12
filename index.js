const format = require('date-fns/format');

const path = require('path');
const request = require('request');
const stream = require('stream');

/**
 * These 2 functions were taken from https://github.com/JosephusYang/s3-transload
 * All credit goes to him for these!
 * I just made a slight modification in the urlToS3 function to pass my whole params rather than just bucket & key
 */
const uploadToS3 = function uploadFromStream(s3, cb) {
	const pass = new stream.PassThrough();
	const params = { Body: pass };
	s3.upload(params).
		on('httpUploadProgress', function(evt) { console.log(evt); }).
		send(function(err, data) { 
			console.log(err, data); 
			if (err) cb(err, data);
			cb(null, data.Location);// data.Location is the uploaded location
		});
	return pass;
};

const urlToS3 = function(url, params, callback) {
	const s3 = new AWS.S3({ params: params });
	const req = request.get(url);
	req.pause();
	req.on('response', function(resp) {
		if (resp.statusCode == 200) {
			req.pipe(uploadToS3(s3, callback));
			req.resume();
		} else {
			callback(new Error('request item did not respond with HTTP 200'));
		}
	});
}

const archiver = function () {
	const baseurl = 'http://aod.tokyofmworld.leanstream.co/storage/tunein_ondemand/';
	const today = format(new Date(), 'YYYYMMDD');
	const filename = `dempa_${today}.mp3`;
	const url = `${baseurl}${filename}`;

	const params = {
		Bucket: 'pagu-dempach-archiver',
		Key: `shows/${filename}`,
		ACL: 'public-read',
		ContentType: 'audio/mpeg',
	};

	urlToS3(url, params, function(error, data) {
		if (error) return console.log(error);
		console.log("The resource URL on S3 is:", data);
	});
};
// module.exports = archiver;

exports.handler = function(event, context, callback) {
  archiver();
}
