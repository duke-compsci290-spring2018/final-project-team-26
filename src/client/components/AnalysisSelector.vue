<template>
	<div id="anal-sel">
		<h4>What kind of analysis do you want?</h4>
		<div class="choice-holder" v-for="choice in Object.keys(choices)">
			<button @click="onSelect(choice)">{{choice}}</button>
			<p>{{choices[choice]}}</p>
		</div>
		
	</div>
</template>

<script>
export default {
	name: "analysis-selector",
	data () {
		return {
			choices: {
				"Sentiment analysis": "Generates a score for positivity vs. negativity: -1.0 for completely negative, 1.0 for completely positive. This analysis is not meant to represent an overall appraisal of opinion, but rather the manner in which opinion is expressed, and so it often leans toward negative scores.",
				"Emotion analysis": "Generates scores, from 0 to 1.0, of how much of the five basic emotions are expressed: joy, sadness, anger, fear, and disgust.",
				"Content analysis": "Determines key topics being discussed.",
				"Entities analysis": "Determines people, places, things, etc. being discussed."
			}
		}
	},
	props: ["onSelect"]
}
</script>

<style lang="scss" scoped>
	$buttonColor1: white;
	$buttonColor2: #4f6a84;
	button {
		font-size: 16pt;
		border-radius: 15px;
		color: $buttonColor1;
		background-color: $buttonColor2;
	}
	button:hover {
		color: $buttonColor2;
		background-color: $buttonColor1;
	}
</style>