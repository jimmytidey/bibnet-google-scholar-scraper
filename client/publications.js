Meteor.parsePublications = {}; 

Meteor.parsePublications.searchPublications = function(search_string) { 
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	Meteor.chrome_extension_xhr.get(url);

}


Meteor.parsePublications.showResults = function(remote_dom) { 

	$(remote_dom).find('#gs_ccl_results > div').each(function(index){ 
		

		var item_number = index + 1;

		console.log('item_number', item_number);

		if($(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ') img ').length > 0) { 
			console.log('this is an author listing ')
			return false
		}
		try {
			var title  			   = $(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri h3  a').text();
			var cluster 		   = $(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri .gs_fl  a:nth-child(1)').attr('href');
			var date			   = parseInt($(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_a').text().split('-')[1].slice(-5));
			var citation_count	   = parseInt($(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_ri .gs_fl a:first-child').text().split('by ')[1]);
			var pdf_link 		   = $(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ') .gs_ggsd a').attr('href'); 
			var authors 		   = $(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ') > div.gs_ri > div.gs_a ').text().split('-')[0];
		} catch (e){
			console.log(e)
			console.log($(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri').html())
		}

		if (title =='') { 
			console.log($(remote_dom).find('#gs_ccl_results > div:nth-child(' + item_number + ')  .gs_ri').html())
		}


		if (isNaN(citation_count)) { 
			citation_count = 0
		} 

		//sometimes a cluster id appears simply not to exist 
		if(typeof cluster == 'undefined' || cluster === 'undefined' || cluster.search("=") ==-1) { 
			console.log('!!!!!!!!!!!!!!!!!!!!!!!!!'); 
			console.log('setting cluster to zero'); 
			culster = 0; 
		} else {
			cluster = cluster.split('=')[1].split('&')[0]
		}

		publication_obj = { 
			title: title,
			google_cluster_id: cluster,
			publication_date: new Date(date+'-01-01'),
			citation_count: citation_count,
			pdf_link: pdf_link,
			authors: authors,
			removed: false
		};

		PublicationsSearchResults.insert(publication_obj);	
	});
}

