Package.describe({
  name: 'tableflip:alchemyjs',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A graph visualization application for the web, packaged for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.1')
  api.use('ecmascript')
  api.use('stevezhu:lodash@3.10.1')
  api.use('d3js:d3@3.4.13')
  api.addFiles('lib/alchemy.js', 'client')
  api.addFiles('lib/alchemy.css', 'client')
  api.export(['alchemy', 'Alchemy'], 'client')
})
