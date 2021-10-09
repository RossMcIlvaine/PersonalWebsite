<script>
	import Footer from './Components/Footer.svelte';
	import InfoBlock from './Components/InfoBlock.svelte';
	let name = "Ross McIlvaine";
	let NDsrc = './images/ND.png'
</script>

<main>
	<h1>Hello, I'm {name}!</h1>
	<p>I'm a computer engineer currently studying in my senior year at Notre Dame.</p>

	<h2>Education</h2>
	<InfoBlock title={"University of Notre Dame"} location={"Notre Dame, IN"} date={"Graduation Date: May 2022"} items_present={false} alt={"University of Notre Dame Logo"} src={NDsrc}/>

	<h2>Experience</h2>
	<InfoBlock title={"Marketing Site Development"} location={"Rochester, NY (Remote)"} date={"June 2021 - August 2021"}
		items={["Launched marketing website redesign from scratch using HTML, CSS, and Javascript inside a Svelte application",
				"Created and managed backend for form submission using AWS DynamoDB, Lambda, and API Gateway",
				"Communicated closely with UI/UX designer and other engineers to build site to design specifications",
				"Worked alongside engineering team in Scrumban development environment",
				"Showcased website advancement to wider organization in multiple team demonstrations"]}/>

	<InfoBlock title={"Campus Wayzz Mobile Application"} location={"Notre Dame, IN"} date={"Spring 2021"}
		items={["Designed UI/UX for campus mapping application",
				"Built frontend screens for app from scratch using JavaScript and the JavaScript React library",
				"Linked user profile information to backend MongoDB database"]}/>

	<InfoBlock title={"Tweet Classification"} location={"Notre Dame, IN"} date={"Fall 2020"}
		items={["Collaborated with team members to identify a twitter user’s political affiliation using twitter data",
				"Assembled relevant datasets and produced cleaned data sets for ease of use in modeling",
				"Incorporated decision tree algorithms for tweet classification using Python"]}/>
	<Footer/>
</main>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
	}

	h1 {
		color: navy;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		text-align: left;
	}

	h2 {
		text-align: left;
	}

	h3 {
		text-align: left;
	}

	p {
		text-align: left;
	}

	li {
		text-align: left;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>