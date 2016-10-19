import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.events({
	'click .find-publication'(event) {
		event.preventDefault();
		console.log('finding publications');
		var search_string = $('.publication_string').val();
		Meteor.parsePublications.searchPublications(search_string);
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
	}, 
	'click .generate-dot-file'(event)  {
		event.preventDefault();
		console.log('generating dot file');
		Meteor.call('generateDotFile', function(err, dotFile){ 
			console.log('dot file returned');
			$('.dot-file').val(dotFile);
		});
	}, 
	'click .generate-cocitation-dot-file'(event)  {
		event.preventDefault();
		console.log('generating cocitation dot file');
		Meteor.call('generateCocitationDotFile', function(err, dotFile){ 
			console.log('dot file returned');
			$('.dot-file').val(dotFile);
		});
	}, 	
});

Template.publicationDate.helpers({
  'cleanDate': function (val) {
		var date_obj  = new Date(val); 
		return  val.getFullYear();
  }
});
 

Template.deletePublication.events({
  'click .delete-publication': function () {
	event.preventDefault();
	console.log('delete publication ' + this._id);
	Meteor.call('deletePublication', this._id);  	
  }
});