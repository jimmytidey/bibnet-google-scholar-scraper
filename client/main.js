import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Template.body.events({
  'click .find-papers'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 	
 	console.log('finding papers');
    var list_of_papers = $('.list-of-papers').val();
    Meteor.call('findPapers', list_of_papers);
  },
});