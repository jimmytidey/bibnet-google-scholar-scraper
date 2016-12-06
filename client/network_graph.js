
Meteor.renderGraph = function(){
    Loading.configure({ color: '#123', elementSelector: '#network_graph_container'}).start();

    Meteor.call('networkVizData', Session.get("current_project"), function(err, res) {
    console.log(res);

        if (err) {
          $('#network_graph_container').html(err.message);
        }

        else {

            Loading.stop();
            
            s = new sigma({
              graph: res,
              renderer: {
                container: 'network_graph_container',
                type: 'canvas'
              },
              settings: {
                labelAlignment:'center',
                labelThreshold:1,
                defaultLabelColor:'#fff',
                minArrowSize:7,
               
                enableEdgeHovering: true,
                edgeHoverColor: 'edge',
                defaultEdgeHoverColor: '#000',
              
                edgeHoverExtremities: true,             
                minNodeSize: 4,
                maxNodeSize: 15                
              }
            });

            s.bind('hovers', function(e) {
              
              if(typeof e.data.current.edges[0]['tootip'] !== 'undefined') {
               
                $('.networkVizContext').html(e.data.current.edges[0]['tootip']);
              }
              
            });           

            var frListener = sigma.layouts.fruchtermanReingold.configure(s, {
              iterations: 500,
              easing: 'quadraticInOut',
              duration: 800
            });
            // Bind the events:
            frListener.bind(' stop', function(e) {
              continueRender()
            });
            // Start the Fruchterman-Reingold algorithm:
            sigma.layouts.fruchtermanReingold.start(s);

            function continueRender() { 
              var noverlapListener = s.configNoverlap({
                nodeMargin: 20,
                scaleNodes: 1.05,
                gridSize: 10,
                easing: 'quadraticInOut', // animation transition function
                duration: 100   // animation duration. Long here for the purposes of this example only
              });
              // Bind the events:
              noverlapListener.bind('start stop interpolate', function(e) {

                if(e.type === 'start') {
                  console.time('noverlap');
                }
                if(e.type === 'interpolate') {
                  console.timeEnd('noverlap');
                }
              });
              // Start the layout:
              s.startNoverlap(); 

              // Initialize the dragNodes plugin:
              var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
            }     
    
        }
    });

}
