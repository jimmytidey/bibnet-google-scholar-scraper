PublicationsSearchResults = new Mongo.Collection('publicationsSearchResults');
PublicationsSearchResultsSchema = new SimpleSchema({
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
	},
	"distance": { 
		type: Number,
		label: 'Distance',
		defaultValue: 20
	},
	"authors": { 
		type: String,
		label: 'Authors'
	},
	"removed": { 
		type: Boolean,
		label: 'Removed',
		defaultValue: false
	}
});
PublicationsSearchResults.attachSchema( PublicationsSearchResultsSchema ); 