<template>
	<div id="presenter">
		<h5>Results of Your Analysis</h5>
		<p v-if="type === 'Sentiment analysis'" id="sentiment-template">On a scale of -1.0 (highly negative) to 1.0 (highly positive), the overall sentiment expressed in the top-level comments analyzed was determined to be {{results.document.label}} with a score of {{results.document.score}}. Keep in mind that this analysis is based on cumulative expression in up to 100 top-level comments, and cannot factor in things like popularity of particular comments or replies to them. These results are not meant to represent an overall appraisal of opinion, but rather the manner in which opinion is expressed, and so it often leans toward negative scores.</p>
		<div v-if="type === 'Emotion analysis'" id="emotion-template">
			<p>On a scale from 0 (not at all detected) to 1.0 (definitely detected), the analysis has given the following scores:</p>
			<ul>
				<li>Joy: {{results.document.emotion.joy}}</li>
				<li>Sadness: {{results.document.emotion.sadness}}</li>
				<li>Anger: {{results.document.emotion.anger}}</li>
				<li>Disgust: {{results.document.emotion.disgust}}</li>
				<li>Fear: {{results.document.emotion.fear}}</li>
			</ul>
		</div>
		<div v-if="type === 'Content analysis'" id="concept-template">
			<p>These are the key concept(s) being discussed according to our analysis:</p>
			<ul>
				<li v-for="el in results">"{{el.text}}", with a relevance score of {{el.relevance}}</li>
			</ul>
		</div>
		<div v-if="type === 'Entities analysis'" id="entity-template">
			<p>These are the key entities being discussed according to our analysis, how often they are mentioned in the 100 top-level comments, and the overall sentiment toward them:</p>
			<ul>
				<li v-for="el in results">
					<h6>{{el.text}}</h6>
					<p>Mentioned {{el.count}} times, receiving a relevance score of {{el.relevance}}. We believe that this is a {{el.type}}. The overall sentiment about {{el.text}} is {{el.sentiment.label}} with a sentiment score of {{el.sentiment.score}}.</p>
				</li>
			</ul>
		</div>
		<button @click="closeMe">Close Analysis</button>
	</div>
</template>

<script>
export default {
	name: 'analysis-presenter',
	props: ['results', 'type', 'closeMe'],
}
</script>

<style>

</style>