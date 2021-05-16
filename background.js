
// // Client ID and API key from the Developer Console
// var CLIENT_ID = '287729568001-rtl2updem083phoqc3tpil51vrqtab5t.apps.googleusercontent.com';
// var API_KEY = 'AIzaSyDsL6elGV3M34xA4D2_J3ij0anPpZr5uqY';

// // Array of API discovery doc URLs for APIs used by the quickstart
// var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];

// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
// var SCOPES = "https://www.googleapis.com/auth/classroom.courses.readonly";

// var authorizeButton = document.getElementById('authorize_button');
// var signoutButton = document.getElementById('signout_button');

// /**
//  *  On load, called to load the auth2 library and API client library.
//  */
// function handleClientLoad() {
//   gapi.load('client:auth2', initClient);
//   console.log('handleclineteaw')
// }

// /**
//  *  Initializes the API client library and sets up sign-in state
//  *  listeners.
//  */
// function initClient() {
//   gapi.client.init({
//     apiKey: API_KEY,
//     clientId: CLIENT_ID,
//     discoveryDocs: DISCOVERY_DOCS,
//     scope: SCOPES
//   }).then(function () {
//     alert('something')
//     // Listen for sign-in state changes.
//     gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
//     alert('something')
//     // Handle the initial sign-in state.
//     updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//     authorizeButton.onclick = handleAuthClick;
//     signoutButton.onclick = handleSignoutClick;
//   }, function (error) {
//     alert('error')
//   });
// }

// function updateSigninStatus(isSignedIn) {
//   if (isSignedIn) {
//     authorizeButton.style.display = 'none';
//     signoutButton.style.display = 'block';
//     listCourses();
//   } else {
//     authorizeButton.style.display = 'block';
//     signoutButton.style.display = 'none';
//   }
// }

// /**
//  *  Sign in the user upon button click.
//  */
// function handleAuthClick(event) {
//   gapi.auth2.getAuthInstance().signIn();
// }

// /**
//  *  Sign out the user upon button click.
//  */
// function handleSignoutClick(event) {
//   gapi.auth2.getAuthInstance().signOut();
// }

// /**
//  * Print the names of the first 10 courses the user has access to. If
//  * no courses are found an appropriate message is printed.
//  */
// function listCourses() {
//   gapi.client.classroom.courses.list({
//     pageSize: 10
//   }).then(function (response) {
//     var courses = response.result.courses;
//     alert(courses[0])
//   });
// }
chrome.identity.getAuthToken({interactive: true}, function(token) {
  console.log('got the token', token);
})

const API_KEY = 'AIzaSyDsL6elGV3M34xA4D2_J3ij0anPpZr5uqY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];

function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });
      
      gapi.client.classroom.courses.list({
        pageSize: 10
      }).then(function(response) {
        console.log(response.result.courses[0].name)
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}


// let signedIn = false;

let reminders = true;
// let autoTurnIn = false;

let countNumber = 0;

let notifications = new Map();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "alarm") {
      let date = request.date;
      let time = request.time;
      let teacher = "Mr. B";
      let assignment = "Flood Fill";
      createAlarm(parseInt(date.substring(0,4)), parseInt(date.substring(5,7))-1, parseInt(date.substring(8,10)), parseInt(time.substring(0,2)), parseInt(time.substring(3)), teacher, assignment)
    }
    if (request.type == "flip-reminders") {
      reminders = !reminders;
    }
    if (request.type=='update-reminders') {
      chrome.runtime.sendMessage({type: 'set-switch', value: reminders});
    }
    // if (request.type=='display-temp') {
    //   gapi.auth2.getAuthInstance().signIn();
    //   listCourses();
    // }
  }
);

function createAlarm(year, month, day, hour, minute, teacher, assignment) {
  countNumber++;
  var timestamp = +new Date(year, month, day, hour, minute, 0);
  chrome.alarms.create(countNumber+"", {
      when: timestamp
  });
  notifications.set(countNumber, {teacher: teacher, assignment: assignment})
  var options = {
    type: 'basic',
    iconUrl: 'notification.ico',
    title: 'Alarm Set! :)',
    message: assignment + " - " + teacher
  }
  let id = "notif"
  chrome.notifications.clear(id);
  chrome.notifications.create(id, options);
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (reminders) {
    if (notifications.has(parseInt(alarm.name))) {
      var options = {
        type: 'basic',
        iconUrl: 'notification.ico',
        title: 'Due in 24 hours!',
        message: notifications.get(parseInt(alarm.name)).assignment + " - " + notifications.get(parseInt(alarm.name)).teacher
      }
      let id = alarm.name
      chrome.notifications.clear(id);
      chrome.notifications.create(id, options);
      notifications.delete(parseInt(alarm.name));
    }
  }
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({url: 'popup.html'})
})