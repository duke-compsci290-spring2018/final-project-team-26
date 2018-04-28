<template>
	<div id="analyze">
		<analyzer-result-entry :video="video" :thumbnail="video.snippet.thumbnails.medium"></analyzer-result-entry>
		<h4>Description:</h4>
		<p id="desc">{{video.snippet.description}}</p>
		<p id="count">I have collected the top {{myComments.length}} comments from this video.</p>
		<analysis-selector :onSelect="requestAnalysis"></analysis-selector>
		<button @click="returnFunc">&larr; Return to search results</button>
	</div>
</template>

<script>
import AnalyzerResultEntry from "./AnalyzerResultEntry.vue";
import AnalysisSelector from "./AnalysisSelector.vue";
import {YOUTUBE_KEY, CLIENT_ID} from "../keys.js";
import {SERVER_URL} from "../heroku_url.js"
export default {
	name: 'analyzer',
	data () {
		return {
			myVideo: this.video,
			myCommentThread: {},
			myComments: []
		}
	},
	props: ['video', "returnFunc"],
	components: {
		AnalyzerResultEntry,
		AnalysisSelector
	},
	created: function() {
		 var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=" + YOUTUBE_KEY + "&maxResults=100&order=relevance&videoId=" + this.myVideo.id.videoId;
		$.get(url).then((response) => {
			this.myCommentThread = response;
			this.myComments = response.items;
			console.log(this.myComments);
		});
	},
	methods: {
		requestAnalysis (type) {
//			this.getCORSData('https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/');
			console.log(type);
			console.log(this.myComments);
			console.log(SERVER_URL);
			fetch(`${SERVER_URL}/analyze`, {
				method: 'POST',
				body: JSON.stringify({
					"type": type,
					"comments": this.myComments
				}),
				headers: {
					"content-type": 'application/json'
				}
			}).then(response => console.log(response))
				.catch(err => console.log(err));
//			var test = "This is a test. What can you do, Watson? I'm very excited to find out, but also somewhat skeptical. Do your best!";
//			var testEncoded = encodeURIComponent(test);
//			var requestURLStart = "https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/analyze?version=2018-03-16&text=";
//			var requestURLRest = "&features=concepts%2Centities%2Cemotion%2Csentiment&return_analyzed_text=true&clean=true&fallback_to_raw=true&concepts.limit=8&emotion.document=true&entities.limit=50&entities.mentions=false&entities.emotion=false&entities.sentiment=false&keywords.limit=50&keywords.emotion=false&keywords.sentiment=false&relations.model=en-news&semantic_roles.limit=50&semantic_roles.entities=false&semantic_roles.keywords=false&sentiment.document=true";
//			var requestURL = requestURLStart + testEncoded + requestURLRest;
//			$.get(requestURL).then((response) => {
//				console.log(response);
//			});
		},
		
		// given a site that does not respond to Access-Control-*
		getCORSData (url) {
			const proxyURL = "https://cors-anywhere.herokuapp.com/";
			fetch(proxyURL + url)
				.then(response => response.json())
				.then(contents => { console.log(contents) })
				.catch(() => console.log("Access to " + url + " is still blocked."))
		}
	}
}
</script>

<style lang="scss" scoped>
	#analyze {
		background-color: #fefff7;
		width: 95%;
		margin-left: 2.5%;
	}
	#desc {
		margin-top: -5px;
	}
	h4, #desc, #count, button {
		margin: 10px;
	}
</style>