Authors = new Mongo.Collection('authors');

AuthorsSchema = new SimpleSchema({
 "name": {
    type: String,
    label: "name"
  },
  "google_author_id": {
    type: String,
    label: "Google author id",
    optional:true,
  },
  "tags": {
    type: [String],
    label: "target",
    optional:true,    
  },
  "institution": {
    type: String,
    label: "target",
    optional:true,    
  },
  "distance": { 
    type: Number,
    label: 'Distance', 
    defaultValue: 20
  }
});

Authors.attachSchema( AuthorsSchema ); 