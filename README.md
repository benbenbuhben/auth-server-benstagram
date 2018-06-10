# Lab 18 - Oauth (Auth Server)

This is Ben and Mike's simple file upload site that uses Facebook's Oauth 2.0 and Mongo's MLab add-on via Heroku. Currently, it is in development mode and only accepts valid test users.

# Getting started

 1. Navigate to [this link](https://ben-mikey-lab-web.herokuapp.com/)
 2. When prompted for Facebook username/password enter the test user sent in the Canvas assignment (you may have to log out of your own Facebook first).
 3. If you get an invalid username error, it is likely due to authorization headers not yet being set up on the client side. To fix this: Pull up your terminal and run ```logs --tail --app=ben-mikey-lab-auth ``` . Then reload the page, go back to the terminal, ctrl+f for 'authorize token', and paste the token into the Google Chrome ModHeader extension as 'Bearer \<token>' .
 4. When successfully authorized, you'll arrive to the File Upload page, where you can upload an image file. Once submitted, the page should display a JSON object with the photo owner's id, and a url to the image file. 
