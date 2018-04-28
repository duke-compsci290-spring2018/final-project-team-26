import {db, searchRef} from '../models/database.js';
import {IBM_CREDENTIALS} from '../models/ibmcreds.js';
export default {
	reportSearched (req, res) {
		searchRef.once('value', (snapshot) => {
			var result = [];
			snapshot.forEach((child) => {
				var item = child.val();
				item['.key'] = child.key;
				result.push(item);
			});
			res.send(JSON.stringify(result));
			res.end();
			console.log(result.length + " videos have been searched.");
		});
	},
	
	addVideo (req, res) {
		var body = req.body;
		var newRef = searchRef.push();
		newRef.set({
			"title": body.snippet.title,
			"channel": body.snippet.channelTitle,
			"description": body.snippet.description
		});
	},
	
	removeVideo (req, res) {
		searchRef.child(req.params['key']).remove();
		req.send(req.params['key']);
		res.end();
	},
	
	requestAnalysis (req, res) {
		console.log(req);
		console.log(req.body);
		console.log(req.params);
		var type = req.body.type;
		var comments = req.body.comments;
		console.log(type);
		console.log(comments);
		var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');//starting code from IBM Watson Documentation
		var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  			'username': IBM_CREDENTIALS.username,
			'password': IBM_CREDENTIALS.password,
			'version': IBM_CREDENTIALS.version
		});//starting code from IBM Watson Documentation
		var choice;
		var additions = {};
		switch(type) {
			case "Sentiment analysis":
				choice = "sentiment";
				break;
			case "Emotion analysis":
				choice = "emotion";
				break;
			case "Content analysis":
				choice = "concepts";
				additions = {
					'limit': 3
				};
				break;
			case "Entities analysis":
				choice = "entities";
				additions = {
					'emotion': true,
					'sentiment': true,
					'limit': 10
				};
				break;
		}
		var results = {};
		var text = "";
		comments.forEach((comment) => {
			text = text + comment.snippet.topLevelComment.snippet.textOriginal + ". ";
		});
		
			var params = {
				'text': text,
				'features': {
					[choice]: additions
				},
				'language': 'en'
			};//modified code from IBM Watson Documentation
				
			natural_language_understanding.analyze(params, (err, response) => {
				if(err) {
					console.log("Error: " + err);
				}
				else {
					console.log("Response from Watson is:");
					console.log(response);
					results = response;
				}
			});//starting code from IBM Watson Documentation
		console.log("Results after Watson are:");
		console.log(results);
		res.send(JSON.stringify(results));
		res.end();
		console.log("The results are back from Watson");
	}
}