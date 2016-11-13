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
	},
  	"authors": {
	    type: String,
	    label: "Authors"
	},	
  	"author_ids": {
	    type: [String],
	    label: "Author IDs",
	    optional:true
	},
  	"search_result_project_ids": {
	    type: [String],
	    label: "Search Result Project IDs",
	    optional:true
	},	
  	"corpus_project_ids": {
	    type: [String],
	    label: "Corpus Project IDs",
	    optional:true
	}
});
Publications.attachSchema( PublicationsSchema ); 

Publications.allow({
    update: function(userId, doc) {
       if(userId){
       		return true
       }
    }
})

