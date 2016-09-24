TabularTables = {};

TabularTables.Authors = new Tabular.Table({
  name: "Authors",
  collection: Authors,
  columns: [
    {data: "name", title: "Name"},
    {data: "google_author_id", title: "Google Author ID"},
    {data: "tags", title: "Tags"},
    {data: "institution", title: "Institution"}
  ]
});

TabularTables.Publications = new Tabular.Table({
  name: "Publications",
  collection: Publications,
  columns: [
    {data: "title", title: "Title"},
    {data: "pdf_link", title: "PDF Link"},
    {data: "publication_date", title: "Date"},
    {data: "google_cluster_id", title: "Google ID"},
    {data: "citation_count", title: "Citation Count"}
  ]
});