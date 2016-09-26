
import { request } from "meteor/froatsnook:request";

bibnet = {}; 

//set up a request object that we can use to get stuff from scholar 
bibnet.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36';
bibnet.cookie_jar = request.jar();

_.each(bibnet.cookies, function(cookie){
	console.log(cookie);
	var cookie = request.cookie(cookie);
	bibnet.cookie_jar.setCookie(cookie, 'https://scholar.google.co.uk');
})

bibnet.requestWithHeaders = request.defaults({
	headers: { "User-Agent": bibnet.user_agent },
	jar:bibnet.cookie_jar
});

bibnet.SearchForPublications = function(search_string) { 
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	console.log('url:  ', url );
	
	var result = bibnet.requestWithHeaders.getSync(url);
	
	$ = cheerio.load(result.body);
	
	for(var i=1; i<11; i++) {
		
		try { 
			bibnet.parsePublication(i); 
		
		} catch(err) {
			console.log(err)
		}
	}
}

bibnet.addCitations = function (cite_search_obj) { 

	var result = bibnet.requestWithHeaders.getSync(cite_search_obj.url);

	console.log(cite_search_obj.url);

	$ = cheerio.load(result.body);
	
	for(var i=1; i<11; i++) {
		try { 
			bibnet.parseCitation(i, cite_search_obj); 
		
		} catch(err) {
			console.log(err)
		}
	}

}

bibnet.isRateLimited = function() { 
	if ($('#gs_captcha_f').length > 0) {
		console.log('Google hates you'); 
		return true 
	} else {
		return false 
	}
}

bibnet.isAuthorListing = function(item_number) { 
	if ($('#gs_ccl_results > div:nth-child(' + item_number + ') img ').length > 0) 
		return true; 
	else { 
		return false; 
	}		
}

bibnet.parseCitation = function(item_number, cite_search_obj) {


	if(bibnet.isRateLimited()) { 
		throw "---------Google hates you------------";
		return false; 
	} 

	// check that this result really is a citation of the author in question
	var relevant_author_name = $('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri .gs_a b').text(); 


	if (relevant_author_name === cite_search_obj.author_obj.name && !bibnet.isAuthorListing(item_number)) { 
		
		target_publication_obj = bibnet.parsePublicationItem(item_number);

		var author_string 		= $('#gs_ccl_results > div:nth-child(' + item_number + ') > div.gs_ri > div.gs_a ').text().split('-')[0];
		var author_array 	   	= author_string.split(','); 

		_.each(author_array, function(val, key){ 
			source_author_obj = { 
				name: val.trim().replace(/\./g,'')
			}   
			bibnet.insertAuthorship(source_author_obj, target_publication_obj)
		});

		source_publication_obj 	= Publications.findOne({google_cluster_id: target_publication_obj.google_cluster_id}); 

		target_publication_obj 	= cite_search_obj.publication_obj; 
		bibnet.insertCitation(source_publication_obj, target_publication_obj); 
	}
	else {
		console.log('Not a relevant citation ' 
			+  relevant_author_name  + ' citing ' + cite_search_obj.publication_obj.title.slice(0,50)); 
	}
} 

bibnet.parsePublication = function(item_number) { 

	if(bibnet.isRateLimited()) { 
		throw "Google hates you";
		return false; 
	} 
	
	target_publication_obj = bibnet.parsePublicationItem(item_number);

	var author_string 		= $('#gs_ccl_results > div:nth-child(' + item_number + ') > div.gs_ri > div.gs_a ').text().split('-')[0];
	var author_array 	   	= author_string.split(','); 

	_.each(author_array, function(val, key){ 
		source_author_obj = { 
			name: val.trim().replace('…', '')
		};
		if (source_author_obj.name !== '') {
			bibnet.insertAuthorship(source_author_obj, target_publication_obj)
		}
	});
}

bibnet.parsePublicationItem = function (item_number) { 

	if($('#gs_ccl_results > div:nth-child(' + item_number + ') img ').length > 0) { 
		console.log('this is an author listing ')
		return false
	}
	
	var title  			   = $('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri h3  a').text();
	var cluster 		   = $('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri .gs_fl  a:nth-child(1)').attr('href').split('=')[1].split('&')[0];
	var date			   = parseInt($('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_a').text().split('-')[1].slice(-5));
	var citation_count	   = parseInt($('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_ri .gs_fl a:first-child').text().split('by ')[1]);
	var pdf_link 		   = $('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_ggsd a').attr('href'); 

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

	console.log('citation obj', edge_obj); 

	extant = Edges.findOne(edge_obj);

	if(extant) { 
		console.log('Already in DB  - ' + source_publication_obj.title.slice(0,30)  + ' \n cites '  + target_publication_obj.title.slice(0,20))
	} else { 
		console.log('Adding citationz  - ' + source_publication_obj.title.slice(0,30)  + ' \n cites '  + target_publication_obj.title.slice(0,20))
		Edges.insert(edge_obj);
	}

}

bibnet.insertAuthorship = function(source_author_obj, target_publication_obj) { 
	
	var source_author_id = bibnet.insertAuthor(source_author_obj);
	var target_publication_id = bibnet.insertPublication(target_publication_obj);

	extant = Edges.findOne({type:'author', source: source_author_id, target: target_publication_id });

	if(extant) { 
		console.log('Authorship edge already in DB  - ' + source_author_obj.name  + ' wrote '  + target_publication_obj.title.slice(0,20))
	} else { 
		console.log('Adding authorship edge - ' + source_author_obj.name  + ' wrote '  + target_publication_obj.title.slice(0,20))
		Edges.insert({type: 'author', source: source_author_id, target: target_publication_id});
	}
}

bibnet.insertPublication = function(publication_obj) { 

	var extant = Publications.findOne({google_cluster_id: publication_obj.google_cluster_id }); 
	if(extant) { 
		console.log('Publication already in DB: ')
		console.log(publication_obj.title.slice(0,40))
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

