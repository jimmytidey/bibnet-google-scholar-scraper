
window.addEventListener('message', function(event) {
 	if(event.data.indexOf("scholar.google")>-1) {
 		
 		console.log('content script called with url: ', event.data); 
		
 		var xhr = new XMLHttpRequest();

		xhr.open("GET", event.data, true);
		
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    console.log('event script did xhr request');
		    console.log(xhr);
		    window.postMessage(xhr.responseText, "http://localhost:3000");
		  }
		}
		
		xhr.send();	 		
 		

	}
}, false);


/* allow normal js to see that the plugin is installed */ 
var plugin_is_installed=document.createElement("div");
plugin_is_installed.setAttribute("class", "bibnet_plugin_is_installed");
document.getElementsByTagName("body")[0].appendChild(plugin_is_installed); 