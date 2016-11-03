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
	deletePublication: function(publication_id, project_id) { 

		console.log('deletePublication called');
		
		Edges.find({type:'author', source:publication_id}).forEach(function(edge_doc){ 
			
			var other_pubs_with_this_author = Publications.find({_id: {$ne: publication_id}, author_ids: edge_doc.target, corpus_project_ids:project_id }).fetch(); 
			
			console.log('other_pubs_with_this_author', other_pubs_with_this_author);

			if(other_pubs_with_this_author.length ===0) { 
				console.log('removing author ',  edge_doc.target);
				Authors.update({_id: edge_doc.target}, {$pop: {author_project_ids: project_id}})
			}
			else { 	
				console.log('this author is authored another publication',  edge_doc.target)
			}
		})

		Publications.update({_id: publication_id}, {$pop: {corpus_project_ids: project_id}});
		 
	},
	parsePublicationHTML: function(html, project_id) { 
		console.log('user_id for parsePublicationHTML', project_id);
		bibnet.parsePublicationHTML(html, project_id) 
	}, 
	clearSearch(proj_id) { 
		console.log('clearing search results');
		Publications.update({},{
			$pull:{search_result_project_ids:proj_id}
		}, {multi:true}); 
	}
});


