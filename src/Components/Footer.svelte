<script>
    import TopButton from './TopButton.svelte';
</script>

<main class='footer'>
    <div class='socials'>
        <a target="_blank" href="https://github.com/RossMcIlvaine" class='fa fa-github'></a>
        <a target="_blank" href="https://www.linkedin.com/in/ross-mcilvaine-95355a16b/" class='fa fa-linkedin'></a>
        <a target="_blank" href="https://www.instagram.com/rossmcilvaine/" class='fa fa-instagram'></a>
        <div class='to-top'>
            <TopButton/>
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
    }
    .socials {
        display: flex;
        justify-content: space-between;
        width: 30%;
    }
    .to-top {
        position: absolute;
        right: 2%;
    }

    /* Styling for font awesome icons */
    .fa {
        background-color: white;
        border-radius: 50%;
        padding: 10px;
        font-size: 30px;
        width: 30px;
        text-align: center;
        text-decoration: none;
        transition: background-color 0.5s, color 0.5s;
    }
    .fa:hover {
        color: white;
    }
    .fa-facebook {
        color: #2D88FF;
        border: 3px solid #2D88FF;
    }
    .fa-facebook:hover {
        background-color: #2D88FF;
    }
    .fa-twitter {
        color: #5DA9DD;
        border: 3px solid #5DA9DD;
    }
    .fa-twitter:hover {
        background-color: #5DA9DD;
    }
    .fa-linkedin {
        color: #0A66C2;
        border: 3px solid #0A66C2;
    }
    .fa-linkedin:hover {
        background-color: #0A66C2;
    }
    .fa-github {
        color: #161B22;
        border: 3px solid #161B22;
    }
    .fa-github:hover {
        background-color: #161B22;
    }
    .fa-instagram {
        color: #E84E47;
        border: 3px solid #E84E47;
    }
    .fa-instagram:hover {
        background-color: #E84E47;
    }

    /* Phone Screen Styles
    @media (max-width: ){
        main {
        }
        .social-links {
            min-height: 60px;
        }
        .socials {
            width: 70%;
            margin-bottom: 10%;
        }
        .fa {
            padding: 5px;
            font-size: 20px;
            width: 20px;
        }
    } */

    /* Edge case screen size 
    @media (min-width: ) and (max-width: ){
    } */

    /* iPad Screen Styles 
    @media (min-width: ) and (max-width: ){
        main {
            
        }
        .social-links {
            min-height: $footer-links-min-height-tablet;
        }
        .socials {
            width: 70%;
        }
    } */

    /* Larger Tablet 
    @media (min-width: ) and (max-width: ) {
        .socials {
            width: 50%;
        }
    } */
</style>