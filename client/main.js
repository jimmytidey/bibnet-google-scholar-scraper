import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.events({
	'click .find-papers'(event) {
		event.preventDefault();
		console.log('finding papers');
		var list_of_papers = $('.list-of-papers').val();
		Meteor.call('findPapers', list_of_papers);
	},
	'click .add-citations'(event) {
		event.preventDefault();
		console.log('adding citations');
		Meteor.call('addCitations');
	},
	'click .remove-citations'(event) {
		event.preventDefault();
		console.log('removing citations');
		Meteor.call('removeCitations');
	}
});