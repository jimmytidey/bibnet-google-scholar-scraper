Publications = new Mongo.Collection('publications');
PublicationsSchema = new SimpleSchema({
	"google_cluster_id": {
	    type: String,
	    label: "Google Cluster ID"
	},
  	"title": {
	    type: String,
	    label: "Google Author ID",
  	},
  	"pdf_link": {
	    type: String,
	    label: "PDF Link ",
	    optional:true,    
  	},
  	"citation_count": {
	    type: Number,
	    label: "Citation Count"
	},
  	"publication_date": {
	    type: Date,
	    label: "Publication Date"
	},
  	"citation_search": {
	    type: Boolean,
	    label: "Citation Search", 
	    defaultValue: false
	}  	

});

Publications.attachSchema( PublicationsSchema ); 