Publications = new Mongo.Collection('publications');
PublicationsSchema = new SimpleSchema({
	"google_cluster_id": {
	    type: String,
	    label: "Google Cluster ID"
	},
  	"title": {
	    type: String,
	    label: "Title",
  	},
  	"pdf_link": {
	    type: String,
	    label: "PDF Link",
	    optional:true,    
  	},
  	"citation_count": {
	    type: Number,
	    label: "Citation Count"
	},
  	"publication_date": {
	    type: Date,
	    label: "Publication Date"
	}
});
Publications.attachSchema( PublicationsSchema ); 