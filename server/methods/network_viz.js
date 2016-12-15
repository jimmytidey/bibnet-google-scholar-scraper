
Meteor.methods({
  networkVizData: function (project_id) {
    console.log('doing network viz')
    
    var edges   = []; 
    var nodes   = [];
    var pub_ids = [];
    var pubs_in_corpus = [];
    var citing_pubs = [];
    var all_pubs = [];
    var citation_edges = [];

    //get all the pubs in this project
    Publications.find({corpus_project_ids:project_id}).forEach(function(pub_obj){ 
      Meteor.networkViz.addPub(nodes, edges, pub_obj, true)
      pub_ids.push(pub_obj._id); 
      all_pubs.push(pub_obj);
    }); 

 
    //get ids of all the pubs that cite pubs in this project
    Edges.find({target:{$in:pub_ids}, type:'cites'}).forEach(function(cite_edge_val){
      citing_pubs.push(cite_edge_val.source);
      citation_edges.push(cite_edge_val)
    });

    //get documents for all the pubs that 
    Publications.find({_id:{$in:citing_pubs}}).forEach(function(pub_obj){ 
      Meteor.networkViz.addPub(nodes, edges, pub_obj, false);
      all_pubs.push(pub_obj);
    });
    
    //do a 'manual join', adding source and target pub docs to each edge doc
    _.each(citation_edges, function(val, key){
      
      var source = _.find(all_pubs, function(obj) { return obj._id == val.source }) 
      var target = _.find(all_pubs, function(obj) { return obj._id == val.target }) 
      var source_author_array = source.authors.split(',');
      var target_author_array = target.authors.split(',');

      _.each(source_author_array, function(source_author,outer_key){ 
        //give all coauthors with coauthor edges

       

        _.each(target_author_array, function(target_author, inner_key){

          Meteor.networkViz.addAuthor(nodes, target_author, true);
          
          if (source_author !== target_author) { 
          
            var edge_obj = {
                  "source": source_author,
                  "target": target_author,
                  "tootip": source_author + ' cites ' + target_author + ' in <em>' + target.title + '</em>',
                  "link_type": "cites",
                  "color": "#99d594",
                  type: 'curvedArrow',
                  "id": Math.floor(100000 + Math.random() * 900000000).toString()
                };

            edges.push(edge_obj); 
          }
        }); 
      });


    });    

    var ret = {
      "nodes": nodes,
      "edges": edges
    };
    
    return ret; 
  }
});

Meteor.networkViz = {};

Meteor.networkViz.addAuthor = function(existing_nodes, name, in_corpus) { 

  var extant = _.find(existing_nodes, function(node) {
  
    if (node.id == name){ 
      node.size = node.size+1; 
      if(in_corpus){
        node.color = '#ef8a62';
      }
      
      return true
    } else { 
      return false
    }
  });
  

  if(typeof extant == 'undefined') {
    new_node = {};
    new_node.id = name; 
    new_node.label = name;
    new_node.color = '#af8dc3';
    new_node.size = 1;
    new_node.x = Math.floor(Math.random() * 10);
    new_node.y = Math.floor(Math.random() * 10);

    if(in_corpus){
        new_node.color = '#ef8a62';
    }    
    existing_nodes.push(new_node);
  } 
} 



Meteor.networkViz.addPub = function(existing_nodes, exising_edges, pub_obj, in_corpus) {
  author_array = pub_obj.authors.split(',');
  
  _.each(author_array, function(outer,outer_key){ 
    
    //add author to node list
    Meteor.networkViz.addAuthor(existing_nodes, outer, in_corpus);   

    //give all coauthors with coauthor edges
    _.each(author_array, function(inner, inner_key){ 
      if (outer !== inner) { 
      
        var edge_obj = {
              "source": outer,
              "target": inner,
              "tootip": inner + ' coauthored <em>' + pub_obj.title + '</em> with ' + outer,
              "link_type": "coauthorship",
              "color": "#67a9cf",
              type: 'curvedArrow',
              "id": Math.floor(100000 + Math.random() * 900000000).toString()
            };
        
        exising_edges.push(edge_obj); 
      }
    }); 
  });
} 




