<template>
	<div id="searcher">
		<label for="text">YouTube Search Box</label>
		<input type="text" placeholder="Type Here to Search For a Video" @keyup.13="search">
		<button id="search-submit" @click="search">Search</button>
		<button id="cancel" @click="undo" v-if="videoIsNotActive === null">Cancel Search</button>
	</div>
</template>

<script>
export default {
	name: "searcher",
	props: ["search", "undo", "videoIsNotActive"]
}
</script>

<style lang="scss" scoped>
	input {
		width: 80%;
		height: 30px;
		font-size: 14pt;
		margin: 2% 1%;
	}
	#search-submit {
		height: 25px;
		font-size: 14pt;
	}
	label {
		display:none;
	}
</style>