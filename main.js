/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  runApp();
});

/**
 * Listens for the app restarting then re-creates the window.
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 */
chrome.app.runtime.onRestarted.addListener(function() {
  runApp();
});

/**
 * Creates the window for the application.
 *
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
function runApp() {
  // Keep screen awake
  chrome.power.requestKeepAwake('display');

  chrome.app.window.create('browser.html', {
    bounds: {
      width: 1024,
      height: 768
    }
  });
}

/**
 * Restars the app at 04:00
 * Checks every minut (60000 miliseconds)
 *
 * @see https://developer.chrome.com/apps/runtime
 */

setInterval(function() {
  var h = 4; // The reboot time in hours (int between 0 - 23)
  var d = new Date();

  // 04:00 Test:
  // var d = new Date('2020-01-06T04:00:00');

  if (d.getHours() === h) {
    // autoreboot kiosk at h time
    chrome.runtime.restart();
  }
}, 60000);
