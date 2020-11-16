# MEAN-resumees-app
This is a simple and fun starting point for a resumees application where a candidate can submit his application and the admin can view and process these applications.

# Steps
Open the front app (resp. back app) directory, install its dependencies then run the developpment server.

Run mongo's server and the backend app will take care of the rest (the collections creation, etc)


# Flow 
1. When the user/candidate clicks on "Home", he will be welcomed with a page that contains a button that will redirect him to a form to fill.

2. With both components written in Node.js, the Angular communicates with the Express back end via RESTful APIs to get and store the informations.

3. Once the form is submitted, an email wil be sent to the user.

4. To visit the admin's panel, go the http://localhost:4200/authentication/signup. Make an admin account then enter the admin's credentials to access the dashboard and manage the candidates applications.
