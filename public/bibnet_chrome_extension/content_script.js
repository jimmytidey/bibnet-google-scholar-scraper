

window.addEventListener('message', function(event) {
 	
	console.log(event);

 	if(event.data.indexOf("scholar.google")>-1) {
 
 		chrome.runtime.sendMessage({url: event.data}, function(response) {
		  console.log(response.farewell);
		});
	}

}, false);




/* allow normal js to see that the plugin is installed */ 
var plugin_is_installed=document.createElement("div");
plugin_is_installed.setAttribute("class", "bibnet_plugin_is_installed");
document.getElementsByTagName("body")[0].appendChild(plugin_is_installed); 