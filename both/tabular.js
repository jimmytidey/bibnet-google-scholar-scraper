TabularTables = {};

TabularTables.Authors = new Tabular.Table({
  name: "Authors",
  collection: Authors,
   selector: function( userId ) {
    var project_ids = []; 
    
    Projects.find({users:userId}).forEach(function(val){ 
      project_ids.push(val._id); 
    });

    console.log('project_ids', project_ids); 

    return {author_project_ids:{$in: project_ids}}
  }, 
  columns: [
    {data: "name", title: "Name"},
  ]
});

TabularTables.Publications = new Tabular.Table({
  name: "Publications",
  collection: Publications,
  selector: function( userId ) {
    var project_ids = []; 
    
    Projects.find({users:userId}).forEach(function(val){ 
      project_ids.push(val._id); 
    });

    console.log('project_ids', project_ids); 

    return {corpus_project_ids:{$in: project_ids, }}
  },
  columns: [
    {data: "title", title: "Title of publication"},
    {data: "authors", title: "Authors"},
    {
      data: 'pdf_link',
      title: "PDF",
      tmpl: Meteor.isClient && Template.pdfLink
    },    
    {
      data: 'publication_date',
      title: "Date",
      tmpl: Meteor.isClient && Template.publicationDate
    },
    {data: "citation_count", title: "Citations"},
    {
      data: '_id',
      title: "Delete",
      tmpl: Meteor.isClient && Template.deletePublication
    }
  ]
});
