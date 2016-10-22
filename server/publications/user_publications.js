Meteor.publish('publicaitons', function tasksPublication() {
	var user_pubs = UserPublications.findOne({user_id: Meteor.usedId()}); 
	return Publications.find(); 
});
