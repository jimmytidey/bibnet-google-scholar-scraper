
bibnet = {}; 


bibnet.getPublicationFromSearch = function(search_string) { 
	
	test = Authors.findOne(); 
   console.log(test);
   
   
   console.log('------');
	
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	console.log('url:  ', url );
	var html = HTTP.call('GET',url);
	
	$ = cheerio.load(html.content);

	var first_result_html = $('#gs_ccl_results div:first-child'); 

	bibnet.parsePublication(1);

   	var cite_link  = $('#gs_ccl_results div:first-child .gs_fl a').attr('href'); 
}

bibnet.parsePublication = function(item_number) { 

	var title  			   = $('#gs_ccl_results > div:nth-child(' + item_number + ') > div.gs_ri > h3 > a').text();
	var cluster 		   = $('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_fl a:nth-child(3)').attr('href').split('=')[1].split('&')[0];
	var date			      = parseInt($('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_a').text().split('-')[1].slice(-5));
	var citation_count	= parseInt($('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_fl a:first-child').text().split('by ')[1]);
	
	target_publication_obj = { 
		title: title,
		google_cluster_id: cluster,
		publication_date: new Date(date+'-01-01'),
		citation_count: citation_count
	}

	var author_string 	= $('#gs_ccl_results > div:nth-child(1) > div.gs_ri > div.gs_a ').text().split('-')[0];
	var author_array 	   = author_string.split(','); 

	console.log('author_arr', author_array);

	_.each(author_array, function(val, key){ 

		source_author_obj = { 
			name: val.trim()
		}
      
      console.log(source_author_obj); 
      
		bibnet.insertAuthorship(source_author_obj, target_publication_obj)
	}); 


}

bibnet.insertCitation = function(source_publication_obj, target_publication_obj) { 
	
	var source_publication_id = bibnet.insertPublication(source_publication_obj);
	var target_publication_id = bibnet.insertPublication(target_publication_obj);

	Edges.insert({type: 'citation', source: source_publication_id, target: target_publication_id});
}

bibnet.insertAuthorship = function(source_author_obj, target_publication_obj) { 
	
	var source_author_id = bibnet.insertAuthor(source_author_obj);
	var target_publication_id = bibnet.insertPublication(target_publication_obj);

	Edges.insert({type: 'author', source: source_author_id, target: target_publication_id});
}

bibnet.insertPublication = function(publication_obj) { 

	console.log('Inserting publication object')
	console.log(publication_obj)

	var extant = Publications.findOne({google_cluster_id: publication_obj.google_cluster_id }); 
	if(extant) { 
		return extant._id 
	}
	else {
		Publications.insert(publication_obj);
	}

	var pub = Publications.findOne({google_cluster_id: publication_obj.google_cluster_id }); 
   
   
   
	return pub._id; 
}

bibnet.insertAuthor = function(author_obj) { 
	var extant = Authors.findOne({name: author_obj.name }); 
	if(extant) { 
		return extant._id 
	}
	else {
	   console.log('inserting author object')
	   console.log(author_obj.name);
		Authors.insert(author_obj);
	}

	var author = Authors.findOne({name: author_obj.name }); 

	return author._id;
} 

bibnet.insertAuthorWithId = function(author_obj) { 


}

bibnet.insertAuthorWithoutId = function(author_obj) { 


}