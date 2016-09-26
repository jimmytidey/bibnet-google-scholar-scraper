


Meteor.methods({
	generateDotFile: function () {
		console.log('generating dot file')
		var begin_string = 'digraph LocalNets {\n'; 
		var edges = []; 
		var nodes = []; 
		var end_string = '}';

		Edges.find().forEach(function(val){ 
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
