function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
    var myid ="1234-1234-12345678";
    var empfaengerid = "";
    chrome.tabs.executeScript(null, { file: "jquery-1.11.3.min.js" }, function() {
	chrome.tabs.executeScript(null, { code: 'var d = $("#mgm_id").attr("mgm_kto"); d '},
		function(results){alert("Empfaenger Kto. Nr. " + results + " \nGeber: " + myid);callBank(null, null, null, myid, results)});
	//<div id="mgm_id" mgm_kto="6">
    });
  });
}

function callBank(searchTerm, callback, errorCallback, sender, empfaenger) {
  var searchUrl = 'http://filip-vfb.cloudapp.net:8080/?name=' + sender + '&empfaenger=' + empfaenger;
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'json';
  x.onload = function() {
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
//      alert('Couldn\'t read result.');
      return;
    }
    var firstResult = response.responseData.results[0];
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(
  function(url) {
    renderStatus('Performing search for ' + url);
  });
});
