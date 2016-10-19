
window.addEventListener('message', function(event) {
 	if(event.data.indexOf("__bibnet_xhr_request__")> -1) {

 		var xhr = new XMLHttpRequest();
 		
		xhr.open("GET", event.data.split('__bibnet_xhr_request__')[1], true);

		
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    console.log('content script did xhr request');
		    	    
		    if(xhr.status == 200) { 
		    	var return_val = '__bibnet_xhr_response__' + xhr.responseText; 
		    } else { 
		    	return_val = '__bibnet_xhr_response__bibnet_error_' + xhr.status; 
		    }

		    console.log(xhr.status);

		    window.postMessage(return_val, "http://localhost:3000");
		  }
		}

		try { 
			xhr.send();
		} catch(e) { 
			return_val = '__bibnet_xhr_response__bibnet_error_' + e; 
			window.postMessage(return_val, "http://localhost:3000");
		}	
	}
}, false);


/* allow normal js to see that the plugin is installed */ 
var plugin_is_installed=document.createElement("div");
plugin_is_installed.setAttribute("class", "bibnet_plugin_is_installed");
document.getElementsByTagName("body")[0].appendChild(plugin_is_installed); 