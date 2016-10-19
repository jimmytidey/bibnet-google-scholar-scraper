
import { request } from "meteor/froatsnook:request";

bibnet = {}; 


bibnet.setupRequest =function() {
	var connection; 

	var use_cookies = false;

	if(use_cookies) { 
		console.log('request with cookies');

		bibnet.cookie_jar = request.jar();

		_.each(bibnet.cookies, function(cookie){
			console.log(cookie);
			var cookie = request.cookie(cookie);
			bibnet.cookie_jar.setCookie(cookie, 'https://scholar.google.co.uk');
		})
		connection = request.defaults({
			jar:bibnet.cookie_jar
		});
	} else { 
		console.log('request without cookies');
		connection = request.defaults();
	}

	return connection;
}

bibnet.SearchForPublications = function(search_string) { 
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	console.log('url:  ', url );
	
	var connection = bibnet.setupRequest(); 
	var result = connection.getSync(url);
	
	$ = cheerio.load(result.body);
	
	var number_of_results = $('#gs_ccl_results > div').length;  
	console.log('number_of_results ', number_of_results); 

	for(var i=1; i<=number_of_results; i++) {
		
		bibnet.parsePublication(i); 
	}
}

bibnet.addCitations = function (cite_search_obj) { 
	
	var connection = bibnet.setupRequest(); 
	var result = connection.getSync(cite_search_obj.url);

	console.log('--------------------------------------------------------------------')
	console.log('--------------------------------------------------------------------')
	console.log('Publication: ', cite_search_obj.publication_obj.title);
	console.log('testing for citations by ', cite_search_obj.author_obj.name)

	$ = cheerio.load(result.body);
	
	var number_of_results = $('#gs_ccl_results > div').length; 
	console.log('number_of_results ------------------->', number_of_results); 

	if(number_of_results ==0) { 
		//console.log($('body').html().substring(0,3000));
	}


	for(var i=1; i<=number_of_results; i++) {
		bibnet.parseCitation(i, cite_search_obj); 
	}

	if(!bibnet.isRateLimited()) {
		Edges.insert({type:'citation_checked', source:cite_search_obj.publication_obj._id, target: cite_search_obj.author_obj._id});
	}

}

bibnet.isRateLimited = function() { 
	if ($('#gs_captcha_f').length > 0 || $('#captcha').length > 0 ) {
		Meteor.clearInterval(bibnet.addCitationsTimer);
		Meteor.clearInterval(bibnet.paperSearchTimer);
		console.log('Google hates you'); 
		console.log($('#gs_captcha_f').html());
		return true 
	} else {
		return false 
	} 
}

bibnet.isAuthorListing = function(item_number) { 
	if ($('#gs_ccl_results > div:nth-child(' + item_number + ') img ').length > 0) { 
		console.log('is author entry');
		return true; 
	} else { 
		return false; 
	}		
}

bibnet.parseCitation = function(item_number, cite_search_obj) {


	// check that this result really is a citation of the author in question
	var author_names 	= $('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri .gs_a ').text(); 
	var surname 		= cite_search_obj.author_obj.name.split(' ')[1];
	
	var author_found 	= author_names.search(surname);

	if (!bibnet.isAuthorListing(item_number) && author_found !==-1) { 
		
		console.log('Found: ', surname)

		target_publication_obj = bibnet.parsePublicationItem(item_number);
		target_publication_obj.distance = item_number + 20;

		var author_string 		= $('#gs_ccl_results > div:nth-child(' + item_number + ') > div.gs_ri > div.gs_a ').text().split('-')[0];
		
		var author_array 	   	= author_string.split(','); 

		_.each(author_array, function(val, key){

		var cleaned_name = val.replace('…', '')
		cleaned_name = cleaned_name.trim()

			source_author_obj = { 
				name: cleaned_name,
				distance: item_number + 20
			}
			if (source_author_obj.name !== '') {
				bibnet.insertAuthorship(target_publication_obj, source_author_obj)
			}
		});

		source_publication_obj 	= Publications.findOne({google_cluster_id: target_publication_obj.google_cluster_id}); 

		target_publication_obj 	= cite_search_obj.publication_obj; 
		bibnet.insertCitation(source_publication_obj, target_publication_obj); 
	}
	else {

		console.log('does not contain: ', surname)
	}
} 

bibnet.parsePublication = function(item_number) { 

	if(bibnet.isRateLimited()) { 
		console.log('google hates you')
		return false; 
	} 
	
	source_publication_obj = bibnet.parsePublicationItem(item_number);
	source_publication_obj.distance = item_number;

	var author_string 		= $('#gs_ccl_results > div:nth-child(' + item_number + ') > div.gs_ri > div.gs_a ').text().split('-')[0];
	var author_array 	   	= author_string.split(','); 

	_.each(author_array, function(val, key){ 
			
		var cleaned_name = val.replace('…', '')
		cleaned_name = cleaned_name.trim()
		target_author_obj = { 
			name: cleaned_name,
			distance: item_number
		};
		
		if (target_author_obj.name !== '') {
			bibnet.insertAuthorship(source_publication_obj, target_author_obj)
		}
	});
}

bibnet.parsePublicationItem = function (item_number) { 

	if($('#gs_ccl_results > div:nth-child(' + item_number + ') img ').length > 0) { 
		console.log('this is an author listing ')
		return false
	}
	try {
		var title  			   = $('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri h3  a').text();
		var cluster 		   = $('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri .gs_fl  a:nth-child(1)').attr('href');
		var date			   = parseInt($('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_a').text().split('-')[1].slice(-5));
		var citation_count	   = parseInt($('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_ri .gs_fl a:first-child').text().split('by ')[1]);
		var pdf_link 		   = $('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_ggsd a').attr('href'); 
	} catch (e){
		console.log(e)
		console.log($('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri').html())
	}

	if (title =='') { 
		console.log($('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri').html())
	}


	if (isNaN(citation_count)) { 
		citation_count = 0
	} 

	//sometimes a cluster id appears simply not to exist 

	console.log('WTF?', cluster.search("="));
	if(typeof cluster == 'undefined' || cluster === 'undefined' || cluster.search("=") ==-1) { 
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!'); 
		console.log('setting cluster to zero'); 
		culster = 0; 
	} else {
		cluster = cluster.split('=')[1].split('&')[0]
	}

	console.log('cluster_id: ',cluster );

	target_publication_obj = { 
		title: title,
		google_cluster_id: cluster,
		publication_date: new Date(date+'-01-01'),
		citation_count: citation_count,
		pdf_link: pdf_link
	}

	return target_publication_obj; 	
}

bibnet.insertCitation = function(source_publication_obj, target_publication_obj) { 

	var edge_obj = {
		type:'cites', 
		source: source_publication_obj._id, 
		target: target_publication_obj._id
	}

	extant = Edges.findOne(edge_obj);

	if(extant) { 
		console.log('Already in DB  - ' + source_publication_obj.title.slice(0,40)  + ' cites '  + target_publication_obj.title.slice(0,40))
	} else { 
		console.log('Adding citation  - ' + source_publication_obj.title.slice(0,40)  + ' cites '  + target_publication_obj.title.slice(0,40))
		Edges.insert(edge_obj);
	}

}

bibnet.insertAuthorship = function(source_publication_obj, target_author_obj) { 

	var source_publication_id = bibnet.insertPublication(source_publication_obj);
	var target_author_id = bibnet.insertAuthor(target_author_obj);

	var edge_obj = {type:'author', source: source_publication_id, target: target_author_id }

	extant = Edges.findOne(edge_obj);

	if(extant) { 
		//console.log('Authorship edge already in DB  - ' + source_publication_obj.title  + ' written by '  + target_author_obj.name)
	} else { 
		console.log('Adding authorship edge - ' + source_publication_obj.title  + ' written by '  + target_author_obj.name)
		Edges.insert(edge_obj);
	}
}

bibnet.insertPublication = function(publication_obj) { 

	var extant = Publications.findOne({google_cluster_id: publication_obj.google_cluster_id }); 
	if(extant) { 
		//console.log('Publication already in DB: ')
		//console.log(publication_obj.title.slice(0,40))
		return extant._id 
	}
	else {
		console.log('Adding publication to DB: ')
		console.log(publication_obj.title.slice(0,40))	
		Publications.insert(publication_obj);
		var pub = Publications.findOne({google_cluster_id: publication_obj.google_cluster_id }); 
		return pub._id; 
	}
	
}

bibnet.insertAuthor = function(author_obj) { 

	var extant = Authors.findOne({name: author_obj.name }); 
	if(extant) { 
		console.log('Author already in DB: ')
		console.log(author_obj.name)
		return extant._id 
	}
	else {
	   console.log('inserting author object:')
	   console.log(author_obj.name);
		Authors.insert(author_obj);
		var author = Authors.findOne({name: author_obj.name }); 
		return author._id;
	}
} 

