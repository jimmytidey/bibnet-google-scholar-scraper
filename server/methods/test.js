Meteor.methods({
	test: function (list) {
		var list = ['ostrom governmeing the commons', 'mancur olson collective action']; 

		_.each(list, function(publication_search_string, key){ 
			Meteor.setTimeout(function(val){
				bibnet.getPublicationFromSearch(publication_search_string);
			}, Math.floor(Math.random() * 1000))	
		})
	}
});

bibnet = {}; 

bibnet.getPublicationFromSearch = function(search_string) { 

	console.log('looking for publication with string: ', val)

	var html = HTTP.call('GET',"https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&q=" + val);
	$ = cheerio.load(html.content);

	bibnet.parsePublication(html);

	if(author_link) { 
       //follow the author link

	} else { 
       //don't follow author link 
	}

   	var cite_link  = $('#gs_ccl_results div:first-child .gs_fl a').attr('href'); 
}

bibnet.parsePublication = function(html) { 

	var publication_title  	= $('#gs_ccl_results div:first-child .gs_a').text().split(' -')[0];
	var publication_cluster = $('#gs_ccl_results div:first-child .gs_a').text().split(' -')[0];
	var publication_date	= $('#gs_ccl_results div:first-child .gs_a').text().split(' -')[0];
	var publication_cites	= parseInt($('#gs_ccl_results div:first-child .gs_fl a:first-child').text().split('by ')[1]);
	
	var author_link  		= $('#gs_ccl_results div:first-child.gs_a a').attr('href');
	var author_name  	   	= $('#gs_ccl_results div:first-child .gs_a').text().split(' -')[0];

}


bibnet.insertCitation = function(source_publication_obj, target_publication_obj) { 
	
	var source_publication_id = bibnet.insertPublication(source_publication_obj);
	var target_publication_id = bibnet.insertPublication(target_publication_obj);

	Edges.insert({type: 'citation', source: source_publication_id, target: target_publication_id});
}

bibnet.insertAuthorship = function(source_author_obj, target_publication_obj) { 
	
	var source_author_id = bibnet.insertAuthor(source_author_obj);
	var target_publication_id = bibnet.insertPublication(target_publication_obj);

	Edges.insert({type: 'citation', source: source_publication_id, target: target_publication_id});
}

bibnet.insertPublication = function(publication_obj) { 

	console.log('Inserting publication object')
	console.log()

	var extant = Publications.findOne({goolge_cluster_id: publication_obj.goolge_cluster_id }); 
	if(extant) { 
		return extant._id 
	}
	else {
		Publications.insert({author_name: publication_obj.author_name, source: source_publication_id, target: target_publication_id});

	}
}

bibnet.insertAuthor = function(author_obj) { 

	if(author_obj.google_author_id){ 
		bibnet.insertAuthorWithId(author_obj)
	} else { 
		bibnet.insertAuthorWithoutId(author_obj)
	}
} 

bibnet.insertAuthorWithId = function(author_obj) { 


}

bibnet.insertAuthorWithoutId = function(author_obj) { 


}