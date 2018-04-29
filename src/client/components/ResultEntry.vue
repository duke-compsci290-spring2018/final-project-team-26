<template>
	<div class="entry" @click="activate(video)">
		<hr>
		<div class="inner">
			<img :src="thumbnail.url" :width="thumbnail.width" :height="thumbnail.height">
			<h3 class="video-title">{{limitTitle(video.snippet.title)}}</h3>
			<span class="creator">{{video.snippet.channelTitle}}</span>
			<span class="publishDate">Published {{extractDate(video.snippet.publishedAt)}}</span>
		</div>
		<hr>
	</div>
</template>

<script>
	export default {
		name: "result-entry",
		props: ["video", "thumbnail", "activate"],
		methods: {
			limitTitle (name) {
				if(name.length < 50) {
					return name;
				}
				else {
					return name.substring(0, 50) + "...";
				}
			},
			extractDate (date) {
				var str = date.split("T")[0];
				var strSplt = str.split("-");
				return strSplt[1] + "/" + strSplt[2] + "/" + strSplt[0];
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
		width: 50%;
		float: right;
		position:relative;
		bottom: 25px;
		text-align: right;
		font-size: 18pt;
		margin: 20px 20px 0 0;
	}
	.creator {
		display:block;
/*
		position: absolute;
		right: 5px;
		bottom: 5px;
*/
	}
	.publishDate {
		font-size: 10pt;
		color: #555555;
	}
	@media (min-width: 768px) {
		.entry {
			width: 90%;
			margin-left: 5%;
		}
		h3 {
			font-size: 20pt;
		}
	}
</style>