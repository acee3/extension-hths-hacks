/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyDsL6elGV3M34xA4D2_J3ij0anPpZr5uqY",
    authDomain: "hths-hackathon.firebaseapp.com",
    projectId: "hths-hackathon",
    storageBucket: "hths-hackathon.appspot.com",
    messagingSenderId: "287729568001",
    appId: "1:287729568001:web:f2ed5da91e4ed5dca03300",
    measurementId: "G-VJKGFKPXBF"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
*/
const auth = firebase.firestore()

// Client ID and API key from the Developer Console
var CLIENT_ID = '287729568001-qdo739eh75tpndqjjmmosv1vc4vpl1ou.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDsL6elGV3M34xA4D2_J3ij0anPpZr5uqY';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/classroom.courses.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listCourses();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
  
  // const googleProvider = new firebase.auth.GoogleAuthProvider();

  // auth.signInWithPopup(googleProvider)
  // .then(() => {
  //   window.location.assign('./profile');
  // })
  // .catch(error => {
  //   console.error(error);
  // })
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names of the first 10 courses the user has access to. If
 * no courses are found an appropriate message is printed.
 */
function listCourses() {
  gapi.client.classroom.courses.list({
    pageSize: 10
  }).then(function(response) {
    var courses = response.result.courses;
    appendPre('Courses:');

    if (courses.length > 0) {
      for (i = 0; i < courses.length; i++) {
        var course = courses[i];
        appendPre(course.name)
      }
    } else {
      appendPre('No courses found.');
    }
  });
}

document.getElementById("function").addEventListener("load", function () {
  document.getElementById("function").onload = function () { };
  handleClientLoad()
  if (document.getElementById("function").readyState === 'complete') document.getElementById("function").onload()
});