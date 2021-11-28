var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/RossMcIlvaine/PersonalWebsite', // Update to point to your repository  
        user: {
            name: 'Ross McIlvaine', // update to use your name
            email: 'rossmcilvaine@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)