
Meteor.renderGraph = function(){
    console.log('network view div rendered, call made');

    Meteor.call('networkVizData', Session.get("current_project"), function(err, res) {
    console.log(res);

        if (err) {
          $('#network_graph_container').html(err.message);
        }

        else {

   var data =       {
  "nodes": [
    {
      "id": "n0",
      "label": "A node",
      "x": 0,
      "y": 0,
      "size": 3
    },
    {
      "id": "n1",
      "label": "Another node",
      "x": 3,
      "y": 1,
      "size": 2
    },
    {
      "id": "n2",
      "label": "And a last one",
      "x": 1,
      "y": 3,
      "size": 1
    }
  ],
  "edges": [
    {
      "id": "e0",
      "source": "n0",
      "target": "n1"
    },
    {
      "id": "e1",
      "source": "n1",
      "target": "n2"
    },
    {
      "id": "e2",
      "source": "n2",
      "target": "n0"
    }
  ]
}

            console.log(data)
     
            s = new sigma({
              graph: res,
              container: 'network_graph_container'
            });

            s.startForceAtlas2({worker: true, barnesHutOptimize: false});
    
        }
    });

}
