document.getElementById("date").value = new Date().toISOString().substring(0,10);
document.getElementById("time").value = new Date().toISOString().substring(11,16);
chrome.runtime.sendMessage({type: 'update-reminders'});
chrome.runtime.sendMessage({type: 'display-temp'});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "set-switch") {
      document.getElementById("reminders").checked = request.value;
    }
  }
);

document.getElementById("reminders").addEventListener("click", function() {
  chrome.runtime.sendMessage({type: 'flip-reminders'});
})

document.getElementById("add-reminder").addEventListener("click", function() {
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;
  chrome.runtime.sendMessage({type: 'alarm', date: date, time: time})
})

// document.getElementById("auto-turn-in").addEventListener("click", function() {
//   autoTurnIn = !autoTurnIn;
// })

document.getElementById("sign-out").addEventListener("click", function() {
  // signedIn = !signedIn;
  document.getElementById("home").style.display='none';
  document.getElementById("login").style.display='block';
})

document.getElementById("sign-in").addEventListener("click", function() {
  // signedIn = !signedIn;
  document.getElementById("login").style.display='none';
  document.getElementById("home").style.display='block';
  // chrome.tabs.create({url: './test/index.html'})
})