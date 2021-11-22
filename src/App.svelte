<script>
	import Footer from './Components/Footer.svelte';
	import HalfScreen from './Components/HalfScreen.svelte';
	import InfoBlock from './Components/InfoBlock.svelte';
	import Skill from './Components/Skill.svelte';
	let name = "Ross McIlvaine";
	let Profilesrc = './images/ProfilePic.jpg';
	let NDsrc = './images/ND.png';
	let Tattlesrc = './images/tattle_logo.png';
	let CWsrc = './images/CW_logo.JPG';
	let Twittersrc = './images/twitter.png';
	let list_items = ['C/C++', 'Python', 'SQL', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'AWS'];
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
					items={["Pursuing Bachelor of Science in Computer Engineering",
							"GPA: 3.8",
							"Dean's List: Fall 2019, Fall 2020, Spring 2021",
							"Relevant Courses: Data Structures, Electric Circuit Analysis, Operating Systems, Data Science, Electronics, Systems Programming, Database Concepts, Computer Architecture, Cryptography, Logic Design, Discrete Mathematics, Introduction to Embedded Systems"]}/>
				<h2>Skills</h2>
				<div class='skills'>
					<Skill skill='programming' {list_items}>
						<i class='fa fa-code' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Programming</h5>
							<p class='skill-desc'>Five+ years of technical coding experience in a variety of languages and platforms including:</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-microphone' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Communication</h5>
							<p class='skill-desc'>I am easy to get along with and enjoy meeting new people, but that doesn't mean I won't voice concerns when they present themselves.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-object-group' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Design</h5>
							<p class='skill-desc'>Passion for creating experiences that look great and work well. Focus is on a quality user experience and accesible solutions.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-folder-open' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Organization</h5>
							<p class='skill-desc'>Keeping an organized workspace makes for more efficient work. I like to make plans to keep myself moving forward.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-graduation-cap' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Quick Learner</h5>
							<p class='skill-desc'>There is no skill that cannot be learned through enough time and effort. When put in an unfamiliar position, I am quick to teach myself the concepts necessary to excel.</p>
						</div>
					</Skill>
				</div>
				<!--
				<h2>Hobbies</h2>
				<div class='skills'>
					<Skill>
						<i class='fa fa-basketball-ball' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Sports</h5>
							<p class='skill-desc'>I've been playing basketball and golf for most of my life. More recently, I've joined the club teams for boxing and GAA at school.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-dumbbell' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Working Out</h5>
							<p class='skill-desc'>I like to keep myself in shape through lifting weights and running. These activities provide a great study break and allow me to come back to work more focused.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-music' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Music</h5>
							<p class='skill-desc'>.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-swimmer' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Scuba Diving</h5>
							<p class='skill-desc'>Living on Long Island has taught me to appreciate the natural beauty of the ocean. I have been scuba certified since 2011.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-skiing' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Skiing</h5>
							<p class='skill-desc'>.</p>
						</div>
					</Skill>
					<Skill>
						<i class='fa fa-film' slot='icon'></i>
						<div class='skill-text' slot='desc'>
							<h5 class='skill-title'>Movies</h5>
							<p class='skill-desc'>.</p>
						</div>
					</Skill>
				</div>
				-->
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

				<InfoBlock title={"Tweet Classification"} location={"Notre Dame, IN"} date={"Fall 2020"} alt={"Twitter Logo"} src={Twittersrc}
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

	.skills {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.skill-text {
		text-align: center;
	}

	.skill-desc {
		text-align: center;
	}

	.fa {
        background-color: white;
        border-radius: 50%;
        padding: 10px;
        font-size: 30px;
        width: 30px;
		text-align: center;
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

	h5 {
		margin: 0;
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