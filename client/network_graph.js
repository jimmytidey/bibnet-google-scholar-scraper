
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
                labelThreshold:4
              }
            });

            s.startForceAtlas2({worker: false, barnesHutOptimize: false});

            setTimeout(function(){ 
              s.stopForceAtlas2();
              continueRender()
            }, 2000);

            function continueRender() { 
              var noverlapListener = s.configNoverlap({
                nodeMargin: 5,
                scaleNodes: 1.05,
                gridSize: 75,
                easing: 'quadraticInOut', // animation transition function
                duration: 100   // animation duration. Long here for the purposes of this example only
              });
              // Bind the events:
              noverlapListener.bind('start stop interpolate', function(e) {
                console.log(e.type);
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
