  Meteor.publish('authors', function tasksPublication() {
    return Authors.find();
  });