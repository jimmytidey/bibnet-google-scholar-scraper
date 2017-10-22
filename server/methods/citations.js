Meteor.methods({

	returnCitationsToCheck: function (project_id) {
		console.log('*******************************************')
		console.log('Return Citations To Check '); 
		
		bibnet.citation_search_array = []; 
		bibnet.citation_search_array_filtered = []; // this array for citations searches that have not been carried out 

		var publications = Publications.find({corpus_project_ids:project_id}, {sort:{citation_count:-1}}).fetch();
		var authors 	 = Authors.find({author_project_ids:project_id}).fetch(); 
		var no_to_return = 40; 
		

		_.some(publications, function(publication, pub_key){
			_.some(authors, function(author, author_key){
				var url = 'https://scholar.google.com/scholar?as_vis=1&q='+ author.name + '&btnG=&hl=en&as_sdt=800005&sciodt=1%2C15&cites='+ publication.google_cluster_id + '&scipsc=1'
				
				var cite_search_obj = { 
					publication_obj	: publication,  
					author_obj		: author,
					url 			: url
				}; 

				bibnet.citation_search_array.push(cite_search_obj)

				if(bibnet.citation_search_array_filtered.length>no_to_return) { 
					return true; 
				}

			}); 

			if(bibnet.citation_search_array_filtered.length>no_to_return) { 
				return true; 
			}
		}); 

		//test to see which of these we've already searched 
		_.some(bibnet.citation_search_array,function(val,key) { 
					
			var extant = Edges.findOne({type:'citation_checked', source:val.publication_obj._id, target: val.author_obj._id});
			
			if(!extant) { 
				bibnet.citation_search_array_filtered.push(val); 
			}

			if(bibnet.citation_search_array_filtered.length>no_to_return) { 
				return true; 
			}
		});
		return bibnet.citation_search_array_filtered;
	}, 
	addCitations: function(cite_obj) { 

		var author_obj = {}
		author_obj.name = cite_obj.author_name
		console.log(author_obj);
 		var author_obj = Authors.findOne({name:cite_obj.author_name});
 		var publication_obj = Publications.findOne({google_cluster_id: cite_obj.google_pub_id});

 		
 		var cite_search_obj = { 
 			author_obj: author_obj,
 			publication_obj: publication_obj,
 			html: cite_obj.html, 
 			project_id: cite_obj.project_id,
 			timer_id: cite_obj.timer_id
 		} 

 		bibnet.addCitations(cite_search_obj);

	},
	clusterIdtoPaperTitle: function(cluster_id) { 
		
 		var publication_obj = Publications.findOne({google_cluster_id: cluster_id});
 		return publication_obj;
	},	
	countRemainingCitations: function (project_id) {
		console.log('*******************************************')
		console.log('Count remaining citations '); 
		
		bibnet.citation_search_array = []; 
		bibnet.citation_search_array_filtered = []; // this array for citations searches that have not been carried out 

		var publications = Publications.find({corpus_project_ids:project_id}).fetch();
		console.log('pubs', publications.length);
		var authors 	 = Authors.find({author_project_ids:project_id}).fetch(); 
		console.log('authors', authors.length);

		_.each(publications, function(publication, pub_key){
			_.each(authors, function(author, author_key){
				var url = 'https://scholar.google.com/scholar?as_vis=1&q='+ author.name + '&btnG=&hl=en&as_sdt=800005&sciodt=1%2C15&cites='+ publication.google_cluster_id + '&scipsc=1'
				
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
					
			var extant = Edges.findOne({type:'citation_checked', source:val.publication_obj._id, target: val.author_obj._id});
			
			if(!extant) { 
				bibnet.citation_search_array_filtered.push(val); 
			}
			if (bibnet.citation_search_array_filtered.length > 50){ 
				return true
			}
		});

		if (bibnet.citation_search_array_filtered.length > 50){ 
			return 'More than 50';
		}
		
		return bibnet.citation_search_array_filtered.length;
	}, 	

});
