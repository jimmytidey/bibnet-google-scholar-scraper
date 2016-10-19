TabularTables = {};

TabularTables.Authors = new Tabular.Table({
  name: "Authors",
  collection: Authors,
  columns: [
    {data: "name", title: "Name"},
  ]
});

TabularTables.Publications = new Tabular.Table({
  name: "Publications",
  collection: Publications,
  columns: [
    {data: "title", title: "Title of publication"},
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

TabularTables.Edges = new Tabular.Table({
  name: "Edges",
  collection: Edges,
  columns: [
    {data: "type", title: "Title"},
    {data: "source", title: "Source"},
    {data: "target", title: "Target"}
  ]
});