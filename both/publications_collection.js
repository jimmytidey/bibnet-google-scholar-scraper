Publications = new Mongo.Collection('publications');
PublicationsSchema = new SimpleSchema({
	"google_cluster_id": {
	    type: String,
	    label: "Type"
	},
  	"title": {
	    type: String,
	    label: "Google author id",
  	},
  	"pdf_link": {
	    type: [String],
	    label: "target",
	    optional:true,    
  	},
  	"citation_count": {
	    type: Number,
	    label: "target"
	},
  	"publication_date": {
	    type: Date,
	    label: "Publication Date"
	}   
});

Publications.attachSchema( PublicationsSchema ); 