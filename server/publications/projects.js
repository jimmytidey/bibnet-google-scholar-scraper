
Meteor.publish('projects', function () {
	var projects = Projects.find({users: this.userId}); 
	return projects;

});

