
var server_url ='https://whocites.com';


document.cookie = "wc_extension_version=1.1";


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
	 	xhr.open("POST", server_url + '/methods/addCitations', true);
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
	 	xhr.open("POST", server_url + '/methods/parsePublicationHTML', true);
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




