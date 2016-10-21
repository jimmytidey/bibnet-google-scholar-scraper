Meteor.methods({
	findPublications: function (list_of_papers) {
		
		console.log('find papers called'); 


		bibnet.list_of_papers = list_of_papers.split(/\n/)

		bibnet.paperSearchTimer = Meteor.setInterval(function(){
			
			if (bibnet.list_of_papers.length > 0) {
				var paper_description_string = bibnet.list_of_papers.pop(); 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH FOR: ', paper_description_string )
				bibnet.SearchForPublications(paper_description_string);
			} else { 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH ENDED');
				Meteor.clearInterval(bibnet.paperSearchTimer);
			}
		}, (Math.random() * 10000) + 2000) 
	},
	deletePublication: function(publication_id) { 

		console.log('deletePublication called');
		
		Edges.find({type:'author', source:publication_id}).forEach(function(edge_doc){ 
			
			var other_pubs_with_this_author = Edges.find({type:'author', source: {$ne: publication_id}, target: edge_doc.target }).fetch(); 
			
			console.log('other_pubs_with_this_author', other_pubs_with_this_author);

			if(other_pubs_with_this_author.length ===0) { 
				console.log('removing author ',  edge_doc.target);
				Authors.remove({_id: edge_doc.target})
			}
			else { 	
				console.log('this author is authored another publication',  edge_doc.target)
			}
			

		})

		Edges.remove({type:'author', source:publication_id});

		Publications.remove({_id: publication_id});
		 
	},
	parsePublicationHTML: function(html) { 
		bibnet.parsePublicationHTML(html) 
	}, 

	addSearchResult: function(search_result){ 
		var author_array 	   	  = search_result.authors.split(','); 
		
		var source_publication_obj = { 
			title: search_result.title,
			google_cluster_id: search_result.google_cluster_id,
			publication_date: search_result.publication_date,
			citation_count: search_result.citation_count,
			pdf_link: search_result.pdf_link
		}

		var new_pub = false;

		_.each(author_array, function(val, key){ 
				
			var cleaned_name = val.replace('…', '')
			cleaned_name = cleaned_name.trim()
			
			target_author_obj = { 
				name: cleaned_name,
				distance: 1
			};
			
			if (target_author_obj.name !== '') {
				var created = bibnet.insertAuthorship(source_publication_obj, target_author_obj);
				if(created) { 
					new_pub = true
				}
			}
		});
		if(new_pub) { 
			return  'added'
		} else { 
			return 'duplicate'
		}
	}
});


