
Meteor.publish('pub_search_results', function (project_id) {	
	console.log('running subscription---->> ', project_id);
	var search_pubs = Publications.find({search_result_project_ids: project_id})
	return search_pubs;
});

