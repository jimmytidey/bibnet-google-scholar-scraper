import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser(function (options, user) {
	Projects.insert({project_name: 'My first project', users: [user._id] })
	return user
});