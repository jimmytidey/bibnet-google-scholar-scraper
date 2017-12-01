
Meteor.methods({
	generateDotFile: function (project_id) {
		console.log('generating dot file')
		var begin_string = 'digraph Bibnets {\n'; 
		var edges = []; 
		var nodes = []; 
		var end_string = '}';
		var pub_ids = [];
		var citing_pub_ids = []

		//get every publication associated with this project
		Publications.find({corpus_project_ids:project_id}).forEach(function(pub_val){
			var pub_string = pub_val._id + ' ' + '[label="'+pub_val.title+'", type="publication"]\n';  
			nodes.push(pub_string); 
			pub_ids.push(pub_val._id); 
			
			//add an edge and a node for every author of this publication
			_.each(pub_val.author_ids, function(auth_id) { 

				var auth_val = Authors.findOne({_id: auth_id})
				var auth_string = auth_val._id + ' ' + '[label="'+auth_val.name+'", type="author"]\n';  
				nodes.push(auth_string); 

				var edge = pub_val._id + ' -> ' + auth_val._id + ' [edge_type=author]\n' ;
				edges.push(edge);
			});		
			
		}); 



		//get every paper that cites one the papers in this project
		Edges.find({target:{$in:pub_ids}, type:'cites'}).forEach(function(cite_edge_val){
			var edge = cite_edge_val.source + ' -> ' + cite_edge_val.target + ' [edge_type=cites]\n' ;
			citing_pub_ids.push(cite_edge_val.source); 
		});

	

		Publications.find({_id: {$in: citing_pub_ids}}).forEach(function(pub_val){
			var pub_string = pub_val._id + ' ' + '[label="'+pub_val.title+'", type="publication"]\n';  
			nodes.push(pub_string); 
			
			//add an edge and a node for every author of this publication
			_.each(pub_val.author_ids, function(auth_id) { 

				var auth_val = Authors.findOne({_id: auth_id})
				var auth_string = auth_val._id + ' ' + '[label="'+auth_val.name+'", type="author"]\n';  
				nodes.push(auth_string); 

				var edge = pub_val._id + ' -> ' + auth_val._id + ' [edge_type=cites]\n' ;
				edges.push(edge);
			});	
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
		var end_string = '}';

		//list of all authors 
		Authors.find({author_project_ids:project_id}).forEach(function(val){ 
			var author_string = val._id + ' ' + '[label="'+val.name+'", type="author"]\n';  
			nodes.push(author_string); 
		});

		Publications.find({corpus_project_ids:project_id}).forEach(function(pub_obj){ 
			
			//check for coauthorship of this publication
			var author_array = Edges.find({type:'author',source:pub_obj._id}).fetch();
			console.log('-->pub_obj._id', pub_obj._id);

			_.each(author_array, function(outer){ 
				_.each(author_array, function(inner){ 
					if (outer.target !== inner.target) { 
						var edge_string = outer.target + ' -> ' + inner.target + ' [edge_type=coauthorship]\n' ;
						edges.push(edge_string); 
					}
				});

				Authors.find({_id:outer.target}).forEach(function(val){ 
					var author_string = val._id + ' ' + '[label="'+val.name+'", type="author"]\n';  
					nodes.push(author_string); 
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

			console.log('citing_author_array', citing_author_array);
			
			//make each citing author cite every author of the original publication, if there are any 
			if(citing_author_array.length>0) {
				
				_.each(citing_author_array, function(citing_author){ 
					_.each(author_array, function(author){
						var edge_string = citing_author + ' -> ' + author.target + ' [edge_type=cites]\n' ;
						edges.push(edge_string); 
					}); 

					Authors.find({_id:citing_author}).forEach(function(val){ 
						var author_string = val._id + ' ' + '[label="'+val.name+'", type="author"]\n';  
						nodes.push(author_string); 
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
