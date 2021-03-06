const axios = require("axios");
const router = require("express").Router();

router.get("/recipes", (req, res) => {
  axios
    .get("http://www.recipepuppy.com/api/", {
      params: req.query
    })
    .then(({
      data: {
        results
      }
    }) => res.json(results))
    .catch(err => res.status(422).json(err));
});

module.exports = router;

const {gapi} = require('googleapis');

function handleClientLoad() {
  // Loads the client library and the auth2 library together for efficiency.
  // Loading the auth2 library is optional here since `gapi.client.init` function will load
  // it if not already loaded. Loading it upfront can save one network request.
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Initialize the client with API key and People API, and initialize OAuth with an
  // OAuth 2.0 client ID and scopes (space delimited string) to request access.
  gapi.client.init({
    apiKey: 'YOUR_API_KEY',
    discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
    clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    scope: 'profile'
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function updateSigninStatus(isSignedIn) {
  // When signin status changes, this function is called.
  // If the signin status is changed to signedIn, we make an API call.
  if (isSignedIn) {
    makeApiCall();
  }
}

function handleSignInClick(event) {
  // Ideally the button should only show up after gapi.client.init finishes, so that this
  // handler won't be called before OAuth is initialized.
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function makeApiCall() {
  // Make an API call to the People API, and print the user's given name.
  gapi.client.people.people.get({
    'resourceName': 'people/me',
    'requestMask.includeField': 'person.names'
  }).then(function (response) {
    console.log('Hello, ' + response.result.names[0].givenName);
  }, function (reason) {
    console.log('Error: ' + reason.result.error.message);
  });
}

// onload = "this.onload=function(){};handleClientLoad()"
// onreadystatechange = "if (this.readyState === 'complete') this.onload()" >
