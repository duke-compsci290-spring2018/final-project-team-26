<template>
	<div id="searcher">
		<input type="text" placeholder="YouTube search" @keyup.13="search">
		<button id="search-submit" @click="search">Search</button>
	</div>
</template>

<script>
export default {
	name: "searcher",
	props: ["search"]
}
</script>

<style lang="scss" scoped>
	input {
		width: 85%;
		height: 25px;
		font-size: 14pt;
		margin: 2% 1%;
	}
	#search-submit {
		height: 25px;
		font-size: 14pt;
	}
</style>