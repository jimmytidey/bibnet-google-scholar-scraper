TabularTables = {};

TabularTables.Authors = new Tabular.Table({
  name: "Authors",
  collection: Authors,
  columns: [
    {data: "name", title: "Name"},
    {data: "_id", title: "ID"},
    {data: "google_author_id", title: "Google Author ID"},
    {data: "tags", title: "Tags"},
    {data: "institution", title: "Institution"},
    {data: "is_first_level", title: "First Level"}
  ]
});

TabularTables.Publications = new Tabular.Table({
  name: "Publications",
  collection: Publications,
  columns: [
    {data: "title", title: "Title"},
    {data: "_id", title: "ID"},
    {data: "pdf_link", title: "PDF Link"},
    {data: "publication_date", title: "Date"},
    {data: "google_cluster_id", title: "Google ID"},
    {data: "citation_count", title: "Citation Count"},
    {data: "is_first_level", title: "First Level"},
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