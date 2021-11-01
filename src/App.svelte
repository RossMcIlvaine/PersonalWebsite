<script>
	import Footer from './Components/Footer.svelte';
	import HalfScreen from './Components/HalfScreen.svelte';
	import InfoBlock from './Components/InfoBlock.svelte';
	let name = "Ross McIlvaine";
	let Profilesrc = './images/ProfilePic.jpg';
	let NDsrc = './images/ND.png';
	let Tattlesrc = './images/tattle_logo.png';
	let CWsrc = './images/CW_logo.JPG';
	let Twittersrc = './images/twitter.png';
</script>

<main>
	<h1>Hello, I'm {name}!</h1>
	<h2><a href='#about-block'>ABOUT ME</a> / <a href='#experience-block'>EXPERIENCE</a> / <a href='#contact-block'>CONTACT ME</a></h2>
	<div id='about-block'>
		<HalfScreen block_type={'resume'}>
			<h1 id='about' slot='section-title'>ABOUT ME</h1>
			<img src={Profilesrc} alt={"Profile Picture"} slot='photo'/>
			<div slot='info'>
				<h2>Education</h2>
				<InfoBlock title={"University of Notre Dame"} location={"Notre Dame, IN"} date={"Graduation Date: May 2022"} alt={"University of Notre Dame Logo"} src={NDsrc}
					items={["Bachelor of Science in Computer Engineering",
							"GPA: 3.8",
							"Dean's List: Fall 2019, Fall 2020, Spring 2021"]}/>
				<h2>Skills</h2>
				<h2>Interests</h2>
			</div>
		</HalfScreen>
	</div>
	<div id='experience-block'>
		<HalfScreen>
			<h1 id='experience' slot='section-title'>EXPERIENCE</h1>
			<div slot='info'>
				<InfoBlock title={"Marketing Site Development"} location={"Rochester, NY (Remote)"} date={"June 2021 - August 2021"} alt={"Tattle Inc Logo"} src={Tattlesrc}
					items={["Launched marketing website redesign from scratch using HTML, CSS, and Javascript inside a Svelte application",
							"Created and managed backend for form submission using AWS DynamoDB, Lambda, and API Gateway",
							"Communicated closely with UI/UX designer and other engineers to build site to design specifications",
							"Worked alongside engineering team in Scrumban development environment",
							"Showcased website advancement to wider organization in multiple team demonstrations"]}/>

				<InfoBlock title={"Campus Wayzz Mobile Application"} location={"Notre Dame, IN"} date={"Spring 2021"} alt={"Campus Wayzz Logo"} src={CWsrc}
					items={["Designed UI/UX for campus mapping application",
							"Built frontend screens for app from scratch using JavaScript and the JavaScript React library",
							"Linked user profile information to backend MongoDB database"]}/>

				<InfoBlock title={"Tweet Classification"} location={"Notre Dame, IN"} date={"Fall 2020"} src={Twittersrc}
					items={["Collaborated with team members to identify a twitter user’s political affiliation using twitter data",
							"Assembled relevant datasets and produced cleaned data sets for ease of use in modeling",
							"Incorporated decision tree algorithms for tweet classification using Python"]}/>
			</div>
		</HalfScreen>
	</div>
	<div id='contact-block'>
		<HalfScreen block_type={'contact'}>
			<h1 id='contact' slot='section-title'>CONTACT ME</h1>
			<div slot='info'>
				<div class='contact-box'>
					<h2>Ross McIlvaine</h2>
					<h3>You Can Reach Me Here:</h3>
					<h4>rossmcilvaine@gmail.com</h4>
					<h4>111 North St Peter St - South Bend, IN 46617</h4>
					<h3>Or Check Out My Socials:</h3>
				</div>
				<Footer top_button_present={false}/>
			</div>
		</HalfScreen>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
	}

	h1 {
		color: rgb(48, 58, 150);
        font-family: 'PT Serif', sans-serif;
		text-transform: uppercase;
		font-size: 4em;
		text-align: center;
	}

	img {
		width: 50%;
		align-self: center;
		margin-bottom: 2%;
	}

	#experience {
        font-family: 'PT Serif', sans-serif;
        font-size: 84px;
        font-style: italic;
        color: white;
    }

	#about {
        font-family: 'PT Serif', sans-serif;
        font-size: 84px;
        font-style: italic;
        color: white;
    }

	#contact {
        font-family: 'PT Serif', sans-serif;
        font-size: 84px;
        font-style: italic;
        color: white;
    }

	.contact-box {
		margin: 2%;
	}

	h2 {
		text-align: center;
		color: rgb(48, 58, 150);
	}

	h3 {
		text-align: left;
	}

	h4 {
		margin-left: 2%;
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