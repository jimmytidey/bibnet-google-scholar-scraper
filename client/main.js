import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
 
Template.body.events({
	'click .find-publication'(event) {
		event.preventDefault();
		Meteor.call('clearSearch', Session.get('current_project'));
		console.log('finding publications');
		var search_string = $('.publication_string').val();
		Meteor.parsePublications.searchPublications(search_string);

	},
	'keypress .publication_string': function (evt, template) {
		
		if (evt.which === 13) {
			Meteor.call('clearSearch', Session.get('current_project')); 
			console.log('finding publications');
			var search_string = $('.publication_string').val();
			Meteor.parsePublications.searchPublications(search_string); 
		}
	},
	'click .add-citations'(event) {
		event.preventDefault();
		console.log('adding citations');	
		Meteor.parsePublications.addCitations();
		
	},
	'click .citation-count'(event) {
		event.preventDefault();
		Meteor.call('countRemainingCitations',Session.get('current_project'), function(err, res){ 
			$('.citation-count-result').html(res);
		});
	}, 
	'click .generate-dot-file'(event)  {
		event.preventDefault();
		console.log('generating dot file');
		$('.dot-file').remove();
		Notifications.success('dot file processing');
		Meteor.call('generateDotFile', Session.get('current_project') ,function(err, dotFile){ 
			$('.gephi-results').append("<p>For now, you'll have to copy any paste this into a text file");
			$('.gephi-results').append("<textarea class='dot-file'></textarea>");
			
			$('.dot-file').val(dotFile);
		});
	}, 
	'click .generate-cocitation-dot-file'(event)  {
		event.preventDefault();
		console.log('generating cocitation dot file');
		Notifications.success('dot file processing');
		$('.dot-file').remove();
		Meteor.call('generateCocitationDotFile', Session.get('current_project') , function(err, dotFile){ 
			$('.gephi-results').append("<p>For now, you'll have to copy any paste this into a text file");
			$('.gephi-results').append("<textarea class='dot-file'></textarea>");
			
			$('.dot-file').val(dotFile);
		});
	},
	'click .logout': function(){
		event.preventDefault();
		console.log('logging out'); 
		Meteor.logout(function(){ 
			Modal.show('loginModal');
		});
	},
	'click .change-project': function(){
		Modal.show('projectsModal');
	},
	'click .showNetworkGraph': function(){
		//Modal.show('networkGraph');
		Meteor.renderGraph();
	}
});



Template.publicationSearchResults.helpers({
	'searchResults': function (val) {
		var proj_id = Session.get('current_project')
		
		
		if(typeof proj_id !== 'undefined') {
			
			Meteor.subscribe('pub_search_results', proj_id);
		}
		var search_pubs = Publications.find({search_result_project_ids: proj_id}, {limit:5});
		return  search_pubs;
	}
});

Template.publicationSearchResults.events({
  'click .remove-search-result': function () {
	event.preventDefault();
 
	Publications.update({_id : this._id}, {
		$pull:{search_result_project_ids:Session.get('current_project')}
	}); 
  },
  'click .add-search-result': function () {
	event.preventDefault();	
	Publications.update({_id : this._id}, {
		$pull:{search_result_project_ids:Session.get('current_project')},
		$addToSet:{corpus_project_ids:Session.get('current_project')}
	}); 

	Notifications.success('Added ' + this.title + ' results');
	var pub = Publications.findOne({_id : this._id});
	
	_.each(pub.author_ids, function(val,key) {
		Authors.update({_id: val}, {$addToSet:{author_project_ids:Session.get('current_project')}});
	});

	Meteor.call('countRemainingCitations',Session.get('current_project'), function(err, res){ 
		$('.citation-count-result').html(res);
	});
  } 
});
 
Template.deletePublication.events({
  'click .delete-publication': function () {
	event.preventDefault();
	console.log('delete publication ' + this._id);
	Meteor.call('deletePublication', this._id, Session.get('current_project'), function(err,res){ 
		Notifications.error('Publication deleted');
	});  	
  }
});

//Current Project Template
Template.currentProject.events({
	'click .change-project': function () {
		event.preventDefault();
		console.log('delete publication ' + this._id);
		Meteor.call('deletePublication', this._id);  	
	}
});

Template.currentProject.helpers({
	'currentProjectDoc': function (val) {
		var current_project_doc = Projects.find({_id: Session.get('current_project')});
		return current_project_doc;
	}
});


//Login Functionality 
Template.body.onRendered(function () {
	if(!Meteor.userId()) {
		Modal.show('loginModal');
	} else {
		
		Meteor.subscribe('projects', Meteor.userId(), function() {
			var current_project = Projects.findOne({users: Meteor.userId()});
			Session.set("current_project", current_project._id);
		});
		
	  	Tracker.autorun(function () { 
	  		if(typeof Session.get('current_project') !== 'undefined') {
				Meteor.call('countRemainingCitations',Session.get('current_project'), function(err, res){ 
					$('.citation-count-result').html(res);
				});
			}
		});	

	}
});
Accounts.onLogout(function() {
	Modal.show('loginModal');
	Session.set('current_project', '');
});


Accounts.onLogin(function() {	
	Modal.hide('loginModal');
	Meteor.subscribe('projects', function() {    
		var current_project = Projects.findOne({users: Meteor.userId()});
		Session.set("current_project", current_project._id);
  	});


});


Template.pluginModal.events({
	'click .plugin-installed': function(){ 
		location.reload();
	}
});

//Projects Template 
Template.projectsModal.events({
	'click .new-project'(event) {
		event.preventDefault();
		console.log('Adding new project');
		var project_name = $('.new-project-text').val();
		Projects.insert({project_name: project_name, users:[Meteor.userId()]});
	},
	'click .list-group-item'(event) {
		event.preventDefault();

		Session.set("current_project", this._id);
		console.log('adding citations');
		Meteor.call('addCitations');
	},
	'click .rename'(event) {
		event.preventDefault();

		console.log('Renaming project');
		var new_name = $('.rename-text').val();
		Projects.update({_id: Session.get("current_project")},{$set:{project_name: new_name}});
	}
});

Template.projectsModal.helpers({
	'projects': function (val) {
		var projects = Projects.find();
		
		return  projects; 
	},
	'is_current_project': function(id) { 
		if (id === Session.get("current_project")) { 
			return 'list-group-item-info';
		}
	}
});


//subscriptions
Template.body.helpers({
  pub_selector: function () {
    return {corpus_project_ids: Session.get("current_project")}; 
  }, 
  auth_selector: function(){
    return {author_project_ids: Session.get("current_project")}; 
  }
});

//set notification times 
Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 7000
    });
});


// Helper for everywhere 
Template.registerHelper(
	'cleanDate', function (val) {
		var date_obj  = new Date(val); 
		return  val.getFullYear();
	}
);





