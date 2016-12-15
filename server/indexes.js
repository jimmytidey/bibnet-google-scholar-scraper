Meteor.startup(function () {  
  Edges._ensureIndex({ "source": 1});
  Edges._ensureIndex({ "target": 1});
  Edges._ensureIndex({ "type": 1});
  Publications._ensureIndex({"search_result_project_ids":1});
  Publications._ensureIndex({"corpus_project_ids":1});
  Authors._ensureIndex({"author_project_ids":1})
});