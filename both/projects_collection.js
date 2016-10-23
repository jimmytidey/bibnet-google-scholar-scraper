Projects = new Mongo.Collection('projects');

ProjectsSchema = new SimpleSchema({
 "project_name": {
    type: String,
    label: "Project Name"
  },
  "users": {
    type: [String],
    label: "Users",
  }
});

Projects.attachSchema( ProjectsSchema ); 

Projects.allow({
    update: function(userId, doc) {
       if(userId){
       		return true
       }
    },
    insert: function(userId, doc) {
       if(userId){
       		return true
       }
    }    
})