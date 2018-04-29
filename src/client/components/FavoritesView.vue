<template>
	<div id="favs" v-if="displayMe">
		<h4>Your Favorite Videos</h4>
		<p v-if="favsList.length === 0">You do not currently have any favorited videos.</p>
		<result-entry v-for="entry in favsList" :video="entry.video" :thumbnail="entry.video.snippet.thumbnails.default" :key="entry.video.id.videoId" :activate="doNothing"></result-entry>
		<button @click="cancel">Close Favorite Videos Panel</button>
	</div>
</template>

<script>
import ResultEntry from "./ResultEntry.vue"
export default {
	name: 'favorites-view',
	props: ['favsList', 'displayMe', 'cancel'],
	components: {
		ResultEntry
	},
	methods: {
		//need to fill "activate" with something inconsequential
		doNothing () {
			return;
		}
	}
}
</script>

<style lang="scss">
	#favs {
		background-color: white;
		border: 10px solid red;
		border-radius: 10px;
		position: fixed;
		top: 25%;
		box-shadow: 0 0 20px 10000px rgba(0,0,0,0.3);
		z-index: 99;
	}
</style>