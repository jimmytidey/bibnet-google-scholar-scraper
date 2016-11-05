
Meteor.methods({
  networkVizData: function (project_id) {
    console.log('doing network viz')
    
    var edges = []; 
    var nodes = [];

    //list of all authors 
    Authors.find({author_project_ids:project_id}).forEach(function(val){ 
      var author_obj = {
        id: val._id,
        label: val.name,
        "color": "#666",
        size: 10,
        x:Math.floor(Math.random() * 10),
        y:Math.floor(Math.random() * 10),

      };
            
      nodes.push(author_obj);
     
    });

    Publications.find({corpus_project_ids:project_id}).forEach(function(pub_obj){ 
      
      //check for coauthorship of this publication
      var author_array = Edges.find({type:'author',source:pub_obj._id}).fetch();
      console.log('-->pub_obj._id', pub_obj._id);

      _.each(author_array, function(outer,outer_key){ 
        _.each(author_array, function(inner, inner_key){ 
          if (outer.target !== inner.target) { 
          
            var edge_obj = {
                  "source": outer.target,
                  "target": outer.target,
                  "type": "coauthorship",
                  "color": "#666",
                  "id": Math.floor(100000 + Math.random() * 900000000).toString()
                };

            edges.push(edge_obj); 
          }
        });

        Authors.find({_id:outer.target}).forEach(function(val){ 
          var author_obj = {
              id: val._id,
              label: val.name,
              "color": "#666",
              size: 10,
              x:Math.floor(Math.random() * 10),
              y:Math.floor(Math.random() * 10),
            };
            
          nodes.push(author_obj); 
         
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
        
        _.each(citing_author_array, function(citing_author){ 
          _.each(author_array, function(author){
            var edge_obj =  {
                "source": citing_author,
                "target": author.target,
                "type": "cites",
                "color": "#666",
                "id":  Math.floor(100000 + Math.random() * 900000000).toString()
            };

            edges.push(edge_obj); 
          }); 

          Authors.find({_id:citing_author}).forEach(function(val){ 
            var author_obj = {
              id: val._id,
              label: val.name,
              "color": "#666",
              size: 10,
              x:Math.floor(Math.random() * 10),
              y:Math.floor(Math.random() * 10),                         
            };
            
            nodes.push(author_obj); 
          });

        }); 
      }
    }); 
    
    var unique_nodes = _.uniq(nodes, false, function(p){ return p.label; })  ; 

    var ret = {
      "nodes": unique_nodes,
      "edges": edges
    };

    console.log(ret);
    
    return ret; 
  }
});




