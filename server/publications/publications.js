Meteor.publish('publicaitons', function tasksPublication() {
	var user_pubs = UserPublications.findOne({user_id: Meteor.usedId()}); 
	return Publications.find(); 
});

Meteor.publish('search_results', function tasksPublication() {
	return Publications.find(); 
});