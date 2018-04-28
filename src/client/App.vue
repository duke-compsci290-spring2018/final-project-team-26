<template>
  <div id="app">
	  <h1>Welcome to the YouTube Comment Analyzer</h1>
	  <h2>Created by Ryan Hill for Comp Sci 290: Web Application Design</h2>
    <div id="main">
		<searcher :search="search" :undo="undoSearch" :videoIsNotActive="activeVideo.id.videoId === ''"></searcher>
		<result-entry v-if="activeVideo.id.videoId === ''" v-for="vid in videos"
					  :video="vid" :thumbnail="vid.snippet.thumbnails.default"
					  :key="vid.id.videoId" :activate="setActiveVideo"></result-entry>
		<analyzer v-if="activeVideo.id.videoId !== ''" :video="activeVideo" :returnFunc="unSetActiveVideo"></analyzer>
	</div>
  </div>
</template>

<script>
import ResultEntry from "./components/ResultEntry.vue";
import Searcher from "./components/Searcher.vue";
import Analyzer from "./components/Analyzer.vue";
import {YOUTUBE_KEY, CLIENT_ID} from "./keys.js";
export default {
  name: 'app',
	data () {
		return {
			videos: [],
			activeVideo: {
				id: {
					videoId: ""
				}
			},
			//some placeholder values for testing
			testtitle: "Test Title",
			testchannel: "Test Channel",
			testlength: "3:50",
			testthumbnail: "",
		}
	},
	
	components: {
		ResultEntry,
		Searcher,
		Analyzer
	},
	
//	created: function () {
//		this.formatSearch("Here is a test");
//	},
	
	methods: {
		//sends the user's search to the YouTube API and puts the result in the videos list
		search () {
			console.log("entered search");
			var mySearch = $("#searcher input").val();
			this.activeVideo = {
				id: {
					videoId: ""
				}
			};
			console.log(mySearch);
			var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&key="+ YOUTUBE_KEY + "&q=";//first part of url to request to (need to format search before putting it in as value for q)
			url += this.formatSearch(mySearch);//complete the url to send the GET request to
			console.log(url);
			//sends GET request to the url and puts the JSON sent back in the videos list
			$.get(url, (ret) => {
				this.videos = ret.items;
			});
		},
		
		//used so that I can check the contents of the videos list
		videosCheck () {
			console.log(this.videos);
			console.log(this.activeVideo);
			console.log(typeof(this.activeVideo));
		},
		
		//takes in a string and formats it to be given in a search request to YouTube in the following form:
		//if it is a single word, do not change it; if there are multiple words, replace the spaces between them with pluses
		formatSearch(str) {
			console.log(str);
			var words = str.split(" ");
			console.log(words);
			var formattedSearch = "";
			if(words.length > 1) {
				words.forEach((word) => {
					formattedSearch = formattedSearch + word + "+"
				});
				console.log(formattedSearch);
				formattedSearch = formattedSearch.substring(0, formattedSearch.length-1);//cut off last '+'
			}
			else {
				formattedSearch = str;//just use str if only one word or less
			}
			console.log(formattedSearch);
			return formattedSearch;
		},
		
		undoSearch() {
			this.videos = [];
			$("#searcher input").val("");
		},
		
		setActiveVideo(vid) {
			console.log("Setting active:");
			console.log(vid);
			this.activeVideo = vid;
		},
		
		unSetActiveVideo() {
			this.activeVideo = {
				id: {
					videoId: ""
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	#main {
		background-color: #ff0023;
		border-radius: 10px;
		padding-left: 5px;
		padding-bottom: 5px;
	}
	h1, h2 {
		text-align: center;
	}
</style>