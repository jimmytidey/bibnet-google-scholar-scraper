
Meteor.publish('search_results', function (project_id) {
	console.log('search_results proj id', project_id); 
	var search_pubs = Publications.find({search_result_project_ids: project_id})
    console.log('search_pubs.fetch()',search_pubs.fetch())
    return search_pubs;
});

