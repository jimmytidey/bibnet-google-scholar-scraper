Meteor.methods({
	addCitations: function () {
		console.log('*******************************************')
		console.log('Add citations called'); 
		
		bibnet.citation_search_array = []; 
		bibnet.citation_search_array_filtered = []; // this array for citations searches that have not been carried out 

		var publications = Publications.find({is_first_level:true}).fetch();
		var authors 	 = Authors.find({is_first_level:true}).fetch(); 

		_.each(publications, function(publication, pub_key){
			_.each(authors, function(author, author_key){
				
				var url = "https://scholar.google.co.uk/scholar?as_vis=1&q="+ author.name +"&btnG=&hl=en&as_sdt=2005&sciodt=0%2C5&cites=" + publication.google_cluster_id + "=1";
				var cite_search_obj = { 
					publication_obj	: publication,  
					author_obj		: author,
					url 			: url
				}; 

				bibnet.citation_search_array.push(cite_search_obj)
			}); 
		}); 

		//test to see which of these we've already searched 
		_.some(bibnet.citation_search_array,function(val,key) { 
			console.log('length', bibnet.citation_search_array_filtered.length);		
			var extant = Edges.findOne({type:'citation_checked', source:val.publication_obj._id, target: val.author_obj._id});
			
			if(!extant) { 
				bibnet.citation_search_array_filtered.push(val); 
			}

			if(bibnet.citation_search_array_filtered.length>20) { 
				return true; 
			}
		});

		console.log('bibnet.citation_search_array_filtered');
		console.log(bibnet.citation_search_array_filtered);
		
		bibnet.addCitationsTimer = Meteor.setInterval(function(){
			if (bibnet.citation_search_array_filtered.length>1) {
				cite_search_obj = bibnet.citation_search_array_filtered.pop(); 
				bibnet.addCitations(cite_search_obj);
			} else { 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH ENDED');
				Meteor.clearInterval(bibnet.addCitationsTimer);
			}
		}, ((Math.random() * 10000) + 4000) );
		
	}, 
});

Meteor.methods({
	removeCitations: function () {
		console.log('Remove citations called'); 
		Edges.remove({type:'cites'}); 
		Edges.remove({type:'citation_checked'}); 
	}, 
});