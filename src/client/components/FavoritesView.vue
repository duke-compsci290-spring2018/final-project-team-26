<template>
	<div id="favs" v-if="displayMe">
		<h4>Your Favorite Videos</h4>
		<p v-if="favsList.length === 0">You do not currently have any favorited videos.</p>
		<div v-for="entry in favsList">
			<result-entry :video="entry.video" :thumbnail="entry.video.snippet.thumbnails.default" :key="entry.video.id.videoId" :activate="doNothing"></result-entry>
			<button class="remove-fav-button" @click="removeFav(entry)">Remove</button>
		</div>
		
		<button @click="cancel">Close Favorite Videos Panel</button>
	</div>
</template>

<script>
import ResultEntry from "./ResultEntry.vue"
export default {
	name: 'favorites-view',
	props: ['favsList', 'displayMe', 'cancel', 'removeFav'],
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
		max-height: 60%;
		overflow: scroll;
	}
	.remove-fav-button {
		float:right;
		position: relative;
		bottom: 45px;
	}
</style>