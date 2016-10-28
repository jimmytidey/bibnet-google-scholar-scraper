
Meteor.methods({
	generateDotFile: function () {
		console.log('generating dot file')
		var begin_string = 'digraph Bibnets {\n'; 
		var edges = []; 
		var nodes = []; 
		var end_string = '}';

		Edges.find({type:{$ne:'citation_checked'}}).forEach(function(val){ 
			var edge_string = val.source + ' -> ' + val.target + '\n' ;
			edges.push(edge_string); 
		});

		Authors.find().forEach(function(val){ 
			var author_string = val._id + ' ' + '[label="'+val.name+'", type="author" , google_author_id="'+val.google_author_id +'", tags="'+val.tags+'", institution="'+val.institution+'"]\n';  
			nodes.push(author_string); 
		});

		Publications.find().forEach(function(val){ 
			var publication_string = val._id + ' ' + '[label="'+val.title+'" , type="pubication" , google_cluster_id="'+val.google_cluster_id +'", pdf_link="'+val.pdf_link+'", citation_count="'+val.citation_count+'", publication_date="'+ new Date(val.publication_date).getFullYear() +'"]\n';  
			nodes.push(publication_string); 
		});

		var all_edges_string = edges.join('');
		var all_nodes_string = nodes.join('');

		var ret = begin_string + all_edges_string + all_nodes_string + end_string; 
		
		return ret; 
	}
});

Meteor.methods({
	generateCocitationDotFile: function (project_id) {
		console.log('generating dot file')
		var begin_string = 'digraph Bibnets {\n'; 
		var edges = []; 
		var nodes = [];
		var end_string = '}';Publications


		//list of all authors 
		Authors.find({author_project_ids:project_id}).forEach(function(val){ 
			var author_string = val._id + ' ' + '[label="'+val.name+'", distance="'+val.distance+'", type="author" , google_author_id="'+val.google_author_id +'", tags="'+val.tags+'", institution="'+val.institution+'"]\n';  
			nodes.push(author_string); 
		});

		Publications.find({corpus_project_ids:project_id}).forEach(function(pub_obj){ 
			
			//check for coauthorship of this publication
			var author_array = Edges.find({type:'author',source:pub_obj._id}).fetch();


			_.each(author_array, function(outer){ 
				_.each(author_array, function(inner){ 
					if (outer.target !== inner.target) { 
						var edge_string = outer.target + ' -> ' + inner.target + ' [edge_type=coauthorship]\n' ;
						edges.push(edge_string); 
					}
				});
			});
			
			//section to find authors who cite this publication 
			var citing_author_array = [];

			//find publications that cite this publication 
			Edges.find({type:'cites',target:pub_obj._id}).forEach(function(citing_pub_obj) { 
				
				//find authors who wrote those citing publication
				Edges.find({type:'author', source:citing_pub_obj.source}).forEach(function(citing_author_obj) { 
					citing_author_array.push(citing_author_obj.target); 
				}); 
			}); 

			//make each citing author cite every author of the original publication, if there are any 
			if(citing_author_array.length>0) {
				console.log('citing_author_array', citing_author_array);
				_.each(citing_author_array, function(citing_author){ 
					_.each(author_array, function(author){
						var edge_string = citing_author + ' -> ' + author.target + ' [edge_type=cites]\n' ;
						edges.push(edge_string); 
					}); 
				}); 
			}
		

		}); 

		var all_edges_string = edges.join('');
		var all_nodes_string = nodes.join('');

		var ret = begin_string + all_edges_string + all_nodes_string + end_string; 
		
		return ret; 
	}, 
	getAlchemyNetwork: function(project_id) { 

	}
});

