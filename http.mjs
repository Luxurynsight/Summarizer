import * as nodeSummary from 'node-summary';
import * as nodeSummarizer from 'node-summarizer';

import * as http from 'http';

const config = {
	httpPort: 9000
};

const getSummary = (title, text, method) => {
	const methods = {
		nodeSummary: (resolve, reject) => {
			nodeSummary.summarize((title||''), (text||''), (err, summary, dict) => {
				// if (err) { return respond(400, `Summarize: ${err.message}`, res); }
				if (err) { return reject(`Summarize: ${err.message}`); }
		
				nodeSummary.getSortedSentences((text||''), 5, (err, sortedSentences) => {
					// if (err) { return respond(400, `getSortedSentences: ${err.message}`, res); }
					if (err) { return reject(`getSortedSentences: ${err.message}`); }
		
					resolve({
						summary: summary,
						extra: {
							sortedSentences: sortedSentences
						}
					});
				}, dict);
			});
		},
		nodeSummarizer: (resolve, reject) => {
			let summarizerManager = nodeSummarizer.SummarizerManager;
			let summarizer = new summarizerManager(text, 4);

			return resolve({
				summary: summarizer.string,
				extra: {
					summarizer
				}
			});
		}
	};

	let callback = methods.nodeSummary;
	if (method && methods[method]) {
		callback = methods[method];
	}

	return new Promise(callback);
};

const respond = (status, message, res, name) => {
	var output = {status: status};
	if (typeof(message) === 'string') {
		output.message = message;
	} else {
		output.data = message;
	}

	console.log(JSON.stringify(output));
	res.writeHead(status, {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Headers': 'Content-type, X-Token'
	});
	res.end(JSON.stringify(output));
	console.log('');
};

http.createServer(async (req, res) => {
	if (req.method === 'OPTIONS') {
		console.log('OPTIONS!!');
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-type, X-Token'
		});
		res.end();
		return;
	}
	if (req.method !== 'POST') {
		return respond(400, 'POST required.', res);
	}
	// if (!req.headers['x-token'] || config.tokens.indexOf(req.headers['x-token']) === -1) {
	// 	return respond(400, 'Invalid request.', res);
	// }

	var statusCode = 200;
	var body = await new Promise((resolve, reject) => {
		let body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			return resolve(body);
		});
	});

	try {
		body = JSON.parse(body);
	} catch (e) {
		return respond(400, 'Bad JSON.', res);
	}

	console.log('Body is: ', body);

	if (typeof(body.text) !== 'string') {
		return respond(400, 'Nothing to do.', res);
	}

	getSummary(body.title, body.text, body.method).then((summary) => {
		return respond(200, summary, res);
	}, (summary) => {
		return respond(400, summary, res);
	});

	
}).listen(config.httpPort, (err) => {
	if (err) {
		return console.log('something bad happened', err);
	}

	console.log(`server is listening on ${config.httpPort}`);
});
