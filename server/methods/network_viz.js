
Meteor.methods({
  networkVizData: function (project_id) {
    console.log('doing network viz')
    
    var edges   = []; 
    var nodes   = [];
    var pub_ids = [];
    var citing_edges = [];

    Publications.find({corpus_project_ids:project_id}).forEach(function(pub_obj){ 
      pub_ids.push(pub_obj._id); 

      author_array = authors.split(',');

      _.each(author_array, function(outer,outer_key){ 
        
        //add author to node list
        Meteor.networkViz.addAuthor(nodes, name);   

        //give all coauthors with coauthor edges
        _.each(author_array, function(inner, inner_key){ 
          if (outer.target !== inner.target) { 
          
            var edge_obj = {
                  "source": outer,
                  "target": inner,
                  "tootip": inner + ' coauthored <br/><em>' + pub_obj.title + '</em><br/> with ' + outer,
                  "link_type": "coauthorship",
                  "color": "#d7191c",
                  type: 'curvedArrow',
                  "id": Math.floor(100000 + Math.random() * 900000000).toString()
                };

            edges.push(edge_obj); 
          }
        }); 
      });
    }); 

 
    //get every paper that cites one the papers in this project
    Edges.find({target:{$in:pub_ids}, type:'cites'}).forEach(function(cite_edge_val){
      var edge = cite_edge_val.source + ' -> ' + cite_edge_val.target + ' [edge_type=cites]\n' ;
      citing_pubs.push(cite_edge_val.source); 
      citing_edges.push(cite_edge_val);
    });


    Publications.find({_id: {$in: citing_pub_ids}}).forEach(function(pub_obj){
      author_array = authors.split(',');

      _.each(author_array, function(outer,outer_key){ 
        
        //add author to node list
        Meteor.networkViz.addAuthor(nodes, name);   

        //give all coauthors with coauthor edges
        _.each(author_array, function(inner, inner_key){ 
          if (outer.target !== inner.target) { 
          
            var edge_obj = {
                  "source": outer,
                  "target": inner,
                  "tootip": inner + ' coauthored <br/><em>' + pub_obj.title + '</em><br/> with ' + outer,
                  "link_type": "coauthorship",
                  "color": "#d7191c",
                  type: 'curvedArrow',
                  "id": Math.floor(100000 + Math.random() * 900000000).toString()
                };

            edges.push(edge_obj); 
          }
        }); 
      });

      //have to make an edges for each citation this paper makes
      var citation_edges = _.filter(citing_edges, function(edge){ 
        edge.source = pub_obj._id
      }); 
      
      _.each(citation_edges, function(edge){ 
        if (outer.target !== inner.target) { 
        
          var edge_obj = {
                "source": edge.source,
                "target": edge.target,
                "tootip": inner + ' coauthored <br/><em>' + pub_obj.title + '</em><br/> with ' + outer,
                "link_type": "coauthorship",
                "color": "#d7191c",
                type: 'curvedArrow',
                "id": Math.floor(100000 + Math.random() * 900000000).toString()
              };

          edges.push(edge_obj); 
        }


    }    

    
    var ret = {
      "nodes": nodes,
      "edges": edges
    };

    console.log(ret);
    
    return ret; 
  }
});

Meteor.networkViz = {};

Meteor.networkViz.addAuthor = function(existing_nodes, name) { 

  var extant = _.find(existing_nodes, function(node) {
    if (node.name == name){ 
      node.size++; 
    } 
  });

  if(typeof extant == 'undefined') {
    new_node = {};
    new_node.id = name; 
    new_node.label = name 
    new_node.color = '#666';
    new_node.size = 15;
    new_node.x = Math.floor(Math.random() * 10);
    new_node.y = Math.floor(Math.random() * 10);
    existing_nodes.push(new_node);
  } 
} 




