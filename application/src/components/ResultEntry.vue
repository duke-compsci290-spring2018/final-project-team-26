<template>
	<div class="entry">
		<img src="thumbnail-url" width="100px">
		<span class="duration">{{length}}</span>
		<h3 class="video-title">{{title}}</h3>
		<span class="creator">{{channel}}</span>
	</div>
</template>

<script>
	export default {
		name: "result-entry",
		props: ["title", "length", "channel", "thumbnail-url"]
	}
</script>

<style lang="scss" scoped>

</style>