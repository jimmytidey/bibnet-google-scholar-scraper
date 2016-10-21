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
	'click .logout': function(){
		console.log('logging out'); 
		Meteor.logout(function(){ 
			Modal.show('loginModal');
		});
	} 	
});

Template.registerHelper(
	'cleanDate', function (val) {
		var date_obj  = new Date(val); 
		return  val.getFullYear();
	}
);

Template.publicationSearchResults.helpers({
	'searchResults': function (val) {
		return  PublicationsSearchResults.find({removed:false});
	}
});

Template.publicationSearchResults.events({
  'click .remove-search-result': function () {
	event.preventDefault();
	console.log('delete publication from results ' + this._id);
	PublicationsSearchResults.update({_id: this._id}, {removed:true})
  },
  'click .add-search-result': function () {
	event.preventDefault();
	var search_res_id = this._id
	var search_result = PublicationsSearchResults.findOne({_id: search_res_id}); 

	console.log(search_result);

	Meteor.call('addSearchResult', search_result, function(err,res){ 
		console.log(res);
		if(err){ 
			Notifications.error('Error:', err);
		}
		if(res ==='added') { 
			Notifications.success('Added');
			PublicationsSearchResults.update({_id: search_res_id}, {removed:true})
		} 
		if(res ==='duplicate') {  
			Notifications.success('Already in');
			PublicationsSearchResults.update({_id: search_res_id}, {removed:true})
		}
	});
  } 
});
 
Template.deletePublication.events({
  'click .delete-publication': function () {
	event.preventDefault();
	console.log('delete publication ' + this._id);
	Meteor.call('deletePublication', this._id);  	
  }
});

Template.body.onRendered(function () {
	if(!Meteor.userId()) {
		Modal.show('loginModal');
	}
});


Accounts.onLogout(function() {
	Modal.show('loginModal');
});


Accounts.onLogin(function() {
	Modal.hide('loginModal');
});



