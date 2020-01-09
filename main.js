var serial = 'not set';

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

  if (chrome.enterprise) {
    chrome.enterprise.deviceAttributes.getDeviceSerialNumber(id => {
      serial = id;
    });
  }
}

function dateString(d = new Date()) {
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function hourString(d = new Date()) {
  return d.getHours();
}

async function sendLogData() {
  var url = 'https://stg.kiosk.laesekompas.dk/v1/log';
  var d = new Date();

  // Data to log: Kiosk log type + Chromebox serial number
  var data = JSON.stringify({
    type: 'KIOSK_REBOOT',
    serial
  });

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    return response;
  } catch (e) {
    // error throw
  }
}

/**
 * Restars the app at t time (example: t = 4 is kl. 04:00)
 * Checks for reboot every minut (60000 miliseconds)
 *
 * @see https://developer.chrome.com/apps/runtime
 */

// clears the storage - for testing
// chrome.storage.local.clear();

var t = 4; // The reboot time in hours (int between 0 - 23)
var lastReboot = null; // Default reboot status

setInterval(function() {
  // String with current date yyyy-mm-dd
  var d = dateString();
  // String with current hour
  var h = hourString();

  // Retrieve last rebot date from storage
  chrome.storage.local.get('lastReboot', function(data) {
    lastReboot = data.lastReboot;

    // Check if chromebox already rebooted
    var hasRebooted = !!(d === lastReboot);

    if (h === t && !hasRebooted) {
      // Sends log to stg.laesekompas.dk that kiosk is rebooting.
      sendLogData().then(() => {
        // Set that chromebox rebooted today
        chrome.storage.local.set({lastReboot: d}, function() {
          // Autoreboot kiosk
          chrome.runtime.restart();
        });
      });
    }
  });
}, 60000);
