

window.addEventListener('message', function(event) {
 	if(event.data.indexOf("__bibnet_xhr_request__")> -1) {

 		var xhr = new XMLHttpRequest();
 		
		xhr.open("GET", event.data.split('__bibnet_xhr_request__')[1], true);
		
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    console.log('content script did xhr request');
		   
		    if(xhr.status == 200) { 

		    	var return_val = '__bibnet_xhr_response__' + xhr.responseURL + '__bibnet_html__' + xhr.responseText; 
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
if(window.location.href == 'http://localhost:3000/'){
	var plugin_is_installed=document.createElement("div");
	plugin_is_installed.setAttribute("class", "bibnet_plugin_is_installed_v05");
	document.getElementsByTagName("body")[0].appendChild(plugin_is_installed); 
}



if(window.location.href.search('scholar.google')>0){ 
	
	if(getParameterByName('wc_cite_search') === 'true') { 
		
		var cite_obj = [{
 			author_name: getParameterByName('q'), 
 			google_pub_id: getParameterByName('cites'), 
 			html: document.documentElement.innerHTML
	 	}]

	 	console.log(cite_obj);
	 	
	 	var data = JSON.stringify(cite_obj);
	 	var xhr = new XMLHttpRequest();
	 	xhr.open("POST", 'https://ba49b26e.ngrok.io/methods/addCitations', true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(data);
	}

	

	function getParameterByName(name, url) {
	    if (!url) {
	      url = window.location.href;
	    }
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
};




