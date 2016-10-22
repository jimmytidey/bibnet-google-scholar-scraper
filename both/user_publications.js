UserPublications = new Mongo.Collection('userPublications');
UserPublicationsSchema = new SimpleSchema({
	"user_id": {
	    type: String,
	    label: "User Id"
	},
  	"in_user_corpus": {
	    type: [String],
	    label: "In user corpus?",
	    optional:true
  	},
  	"search_results": {
	    type: [String],
	    label: "Search results",
	    optional:true
  	}
});
UserPublications.attachSchema( UserPublicationsSchema ); 