<template>
	<div id="analyze">
		<button @click="returnFunc" class="return-button">&larr; Return to search results</button>
		<button v-if="isUser" @click="addFav(video)">Add this video to my favorites</button>
		<analyzer-result-entry :video="video" :thumbnail="video.snippet.thumbnails.medium"></analyzer-result-entry>
		<h4>Description:</h4>
		<p id="desc">{{video.snippet.description}}</p>
		<p id="count">I have collected the top {{myComments.length}} comments from this video.</p>
		<analysis-selector :onSelect="requestAnalysis"></analysis-selector>
		<div id="loading" v-if="isLoading">
			<p>Fetching your analysis. Please wait...</p>
		</div>
		<analysis-presenter v-if="this.resultsActive" :closeMe="closeAnalysis" :results="this.myResults" :type="this.currentAnalysis"></analysis-presenter>
		<button @click="returnFunc" class="return-button">&larr; Return to search results</button>
	</div>
</template>

<script>
import AnalyzerResultEntry from "./AnalyzerResultEntry.vue";
import AnalysisSelector from "./AnalysisSelector.vue";
import AnalysisPresenter from "./AnalysisPresenter.vue";
import {YOUTUBE_KEY, CLIENT_ID} from "../keys.js";
import {SERVER_URL} from "../heroku_url.js"
export default {
	name: 'analyzer',
	data () {
		return {
			myVideo: this.video,
			myCommentThread: {},
			myComments: [],
			myResults: {},
			currentAnalysis: "",
			resultsActive: false,
			isLoading: false
		}
	},
	props: ['video', "returnFunc", 'analysisRecord', 'isUser', 'addFav'],
	components: {
		AnalyzerResultEntry,
		AnalysisSelector,
		AnalysisPresenter
	},
	created: function() {
		 var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=" + YOUTUBE_KEY + "&maxResults=100&order=relevance&videoId=" + this.myVideo.id.videoId;
		$.get(url).then((response) => {
			this.myCommentThread = response;
			this.myComments = response.items;
			console.log(this.myComments);
		}).catch(error => {
			console.log(error);
		});
	},
	methods: {
		requestAnalysis (type) {
//			this.getCORSData('https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/');
			console.log(type);
			console.log(this.myComments);
			console.log(SERVER_URL);
			this.isLoading = true;
			fetch(`${SERVER_URL}/analyze`, {
				method: 'POST',
				body: JSON.stringify({
					"type": type,
					"comments": this.myComments
				}),
				headers: {
					"content-type": 'application/json'
				}
			}).then(response => response.json())
			.then(data => {
				this.isLoading = false;
				console.log(data);
				if(this.isUser) {
					this.analysisRecord(this.myVideo, type);
				}
				if(type === "Sentiment analysis") {
					console.log(data.sentiment);
					this.showResults(data.sentiment, type);
				}
				else if(type === "Emotion analysis") {
					console.log(data.emotion);
					this.showResults(data.emotion, type);
				}
				else if(type === "Content analysis") {
					console.log(data.concepts);
					this.showResults(data.concepts, type);
				}
				else {
					console.log(data.entities);
					this.showResults(data.entities, type);
				}
			})
			.catch(err => console.log(err));
		},
		
		// given a site that does not respond to Access-Control-*
		getCORSData (url) {
			const proxyURL = "https://cors-anywhere.herokuapp.com/";
			fetch(proxyURL + url)
				.then(response => response.json())
				.then(contents => { console.log(contents) })
				.catch(() => console.log("Access to " + url + " is still blocked."))
		},
		
		showResults (data, analysisType) {
			this.myResults = data;
			this.currentAnalysis = analysisType;
			this.resultsActive = true;
		},
		
		closeAnalysis () {
			this.myResults = {};
			this.currentAnalysis = "";
			this.resultsActive = false;
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
	.return-button {
		display:block;
	}
	#loading {
		position: fixed;
		top: 33%;
		font-size: 24pt;
		text-align: center;
		padding: 5%;
		background-color: white;
		border: 7px solid red;
		border-radius: 10px;
		box-shadow: 0 0 20px 10000px rgba(0,0,0,0.3);
	}
</style>