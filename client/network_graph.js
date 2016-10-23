
function render_graph(_this){
  console.log('network view div rendered, call made');
  _this.loading.set(true)
  Meteor.call('getAlchemyNetwork', Session.get("current_project"), function(err, res) {
    _this.loading.set(false)
    if (err) {
      $('#network_graph_container').html(err.message);
    }

    else {
      $('#network_graph_container').css('background-color', 'black');

      console.log(res);
      alchemy.begin({
        dataSource: res,
        divSelector: '#network_graph_container',
        nodeCaption: 'caption',
        curvedEdges: true,

        graphHeight: function(){return 400},
        'nodeOverlap':150,
        nodeStyle: {
        "all": {
            "radius": 10,
            'nodeOverlap':250,
            "borderColor": function (d) { return d._properties.colour},
            "color": function (d) { return 'white'},
            "captionColor": "#FFFFFF",
            "captionBackground": null,
            "captionSize": 12,
            "selected": {
                "color" : "#FFFFFF",
                "borderColor": "#349FE3"
            },
            "highlighted": {
                "color" : "#EEEEFF"
            },
            "hidden": {
                "color": "none",
                "borderColor": "none"
            }
        }
    }
      });
    }
  });

}
