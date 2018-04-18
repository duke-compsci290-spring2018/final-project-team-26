<template>
	<div id="analyze">
		<result-entry :video="video" :thumbnail="video.snippet.thumbnails.medium"></result-entry>
		<h4>Description:</h4>
		<p id="desc">{{video.snippet.description}}</p>
		<p id="count">I have collected the top {{myComments.length}} comments from this video.</p>
		<analysis-selector :onSelect="requestAnalysis"></analysis-selector>
		<button @click="returnFunc">&larr; Return to search results</button>
	</div>
</template>

<script>
import ResultEntry from "./ResultEntry.vue";
import AnalysisSelector from "./AnalysisSelector.vue";
import {YOUTUBE_KEY, CLIENT_ID} from "../keys.js";
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
		ResultEntry,
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
			console.log(type);
			console.log(this.myComments);
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
</style>