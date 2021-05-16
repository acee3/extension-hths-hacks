document.getElementById("date").value = new Date().toISOString().substring(0,10);
document.getElementById("time").value = new Date().getHours() + ':' + new Date().getMinutes();

function createAlarm(year, month, day, hour, minute) {
  var timestamp = +new Date(year, month, day, hour, minute, 0);
  chrome.alarms.create('alarm', {
      when: timestamp
  });
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (reminders) {
    if (alarm.name === 'alarm') {
      var options = {
        type: 'basic',
        iconUrl: 'notification.ico',
        title: 'You just missed the deadline!',
        message: "That\'s not very good"
      }
      let id = 'notif'
      chrome.notifications.clear(id);
      chrome.notifications.create(id, options);
    }
  }
});



// let signedIn = false;

let reminders = true;
// let autoTurnIn = false;

document.getElementById("reminders").addEventListener("click", function() {
  reminders = !reminders;
})

document.getElementById("add-reminder").addEventListener("click", function() {
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;
  createAlarm(parseInt(date.substring(0,4)), parseInt(date.substring(5,7))-1, parseInt(date.substring(8,10)), parseInt(time.substring(0,2)), parseInt(time.substring(3)))
})

// document.getElementById("auto-turn-in").addEventListener("click", function() {
//   autoTurnIn = !autoTurnIn;
// })

// document.getElementById("sign-out").addEventListener("click", function() {
//   signedIn = !signedIn;
//   document.getElementById("home").style.display='none';
//   document.getElementById("login").style.display='block';
// })

// document.getElementById("sign-in").addEventListener("click", function() {
//   signedIn = !signedIn;
//   document.getElementById("login").style.display='none';
//   document.getElementById("home").style.display='block';
// })