Edges = new Mongo.Collection('edges');

EdgesSchema = new SimpleSchema({
 "type": {
    type: String,
    label: "Type"
  },
  "source": {
    type: SimpleSchema.RegEx.Id,
    label: "Coffee Farm Name",
  },
  "target": {
    type: SimpleSchema.RegEx.Id,
    label: "target"
  }
});

Edges.attachSchema( EdgesSchema ); 