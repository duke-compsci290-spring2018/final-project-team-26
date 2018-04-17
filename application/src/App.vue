<template>
  <div id="app">
    <div id="main">
		<searcher :search="beginSearch"></searcher>
		<result-entry :title="testtitle" :channel="testchannel" :length="testlength" :thumbnail-url="testthumbnail"></result-entry>
	</div>
  </div>
</template>

<script>
import ResultEntry from "./components/ResultEntry.vue";
import Searcher from "./components/Searcher.vue";
export default {
  name: 'app',
	data () {
		return {
			testtitle: "Test Title",
			testchannel: "Test Channel",
			testlength: "3:50",
			testthumbnail: "",
		}
	},
	components: {
		ResultEntry,
		Searcher
	},
	methods: {
		beginSearch () {
			var search = $("#searcher").val();
			buildApiRequest('GET',
                '/youtube/v3/search',
                {'maxResults': '25',
                 'part': 'snippet',
                 'q': search,
                 'type': 'video'});
		}
	}
}
</script>

<style lang="scss" scoped>
	#app {
		background-color: #ff0023;
		border-radius: 10px;
	}
</style>