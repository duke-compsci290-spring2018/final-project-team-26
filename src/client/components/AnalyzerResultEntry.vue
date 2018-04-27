<template>
	<div class="entry" @click="activate(video)">
		<hr>
		<div class="inner">
			<h3 class="video-title">{{video.snippet.title}}</h3>
			<span class="creator">By {{video.snippet.channelTitle}}</span>
			<img :src="thumbnail.url" :width="thumbnail.width" :height="thumbnail.height">
			
		</div>
		<hr>
	</div>
</template>

<script>
	export default {
		name: "analyzer-result-entry",
		props: ["video", "thumbnail", "activate"],
		methods: {
			limitTitle (name) {
				if(name.length < 50) {
					return name;
				}
				else {
					return name.substring(0, 50) + "...";
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.entry {
		background-color: #fefff7;
		margin: 0 5px;
		position:relative;
	}
	.inner {
		padding: 5px;
	}
	h3 {
		width: 90%;
	}
	.creator {
		display:block;
	}
	@media (max-width: 480px) {
		img {
			width: 95%;
			height: auto;
			margin-left: 2.5%;
		}
		h3 {
			text-align: center;
		}
	}
	@media (min-width: 768px) {
		.entry {
			width: 90%;
			margin-left: 5%;
		}
		h3 {
			font-size: 18pt;
		}
	}
</style>