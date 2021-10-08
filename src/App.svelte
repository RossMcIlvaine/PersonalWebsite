<script>
	import Footer from './Components/Footer.svelte';
	let name = "Ross McIlvaine";
</script>

<main>
	<h1>Hello, I'm {name}!</h1>
	<p>I'm a computer engineer currently studying in my senior year at Notre Dame.</p>

	<h2>Education</h2>
	<h3>University of Notre Dame</h3>

	<h2>Experience</h2>
	<h3>Marketing Site Development</h3>
	<ul>
		<li>Launched marketing website redesign from scratch using HTML, CSS, and Javascript inside a Svelte application</li>
		<li>Created and managed backend for form submission using AWS DynamoDB, Lambda, and API Gateway</li>
		<li>Communicated closely with UI/UX designer and other engineers to build site to design specifications</li>
		<li>Worked alongside engineering team in Scrumban development environment</li>
		<li>Showcased website advancement to wider organization in multiple team demonstrations</li>
	</ul>
	<h3>Campus Wayzz Application</h3>
	<ul>
		<li>Designed UI/UX for campus mapping application</li>
		<li>Built frontend screens for app from scratch using JavaScript and the JavaScript React library</li>
		<li>Linked user profile information to backend MongoDB database</li>
	</ul>
	<h3>Tweet Classification</h3>
	<ul>
		<li>Collaborated with team members to identify a twitter user’s political affiliation using tweet data</li>
		<li>Assembled relevant datasets and produced cleaned data sets for ease of use in modeling</li>
		<li>Incorporated decision tree algorithms for tweet classification using Python</li>
	</ul>
	<Footer/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>