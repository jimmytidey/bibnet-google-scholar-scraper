
var server_url ='https://whocites.com';

/* allow normal js to see that the plugin is installed */ 
if(window.location.href == 'http://localhost:3000/' || window.location.href == 'https://whocites.com'){
	var plugin_is_installed=document.createElement("div");
	plugin_is_installed.setAttribute("class", "bibnet_plugin_is_installed_v07");
	document.getElementsByTagName("body")[0].appendChild(plugin_is_installed); 
}


if(window.location.href.search('scholar.google')>0){ 
	
	if(getParameterByName('wc_cite_search') === 'true') { 
		
		var cite_obj = [{
 			author_name: getParameterByName('q'), 
 			google_pub_id: getParameterByName('cites'), 
 			html: document.documentElement.innerHTML, 
 			project_id: getParameterByName('project_id') 
	 	}]

	 	console.log(cite_obj);
	 	
	 	var data = JSON.stringify(cite_obj);
	 	var xhr = new XMLHttpRequest();
	 	xhr.open("POST", server_url + '/addCitations', true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(data);
	}

	if(getParameterByName('wc_pub_search') === 'true') {

		var cite_obj = [
 			document.documentElement.innerHTML,
 			getParameterByName('project_id') 
 		]

	 	console.log(cite_obj);
	 	
	 	var data = JSON.stringify(cite_obj);
	 	var xhr = new XMLHttpRequest();
	 	xhr.open("POST", server_url + '/parsePublicationHTML', true);
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




