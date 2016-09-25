Edges = new Mongo.Collection('edges');

EdgesSchema = new SimpleSchema({
 "type": {
    type: String,
    label: "Type"
  },
  "source": {
    type: SimpleSchema.RegEx.Id,
    label: "Source",
  },
  "target": {
    type: SimpleSchema.RegEx.Id,
    label: "Target"
  }
});

Edges.attachSchema( EdgesSchema ); 