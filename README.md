# bibnet-google-scholar-scraper

This is a meteor project, so you'll need to install Meteor to run it:
https://www.meteor.com/install

## How to make it work
You'll be presented with a text area. You can paste search terms into this area. Each new line constitutes a new search term.

When you click 'Find Papers' Bibnet records each paper or book that is returned by Google Scholar (up to 10 results per term) for each of the search terms. This information generates a list of publications in a database. In the same database, it also records who wrote each publication as a list of authors.

When you click 'Add citations' Using Google Scholar’s ‘search within citations’ it checks to see if any of the authors recorded to the database have cited any of the publications. This process will only trigger 40 queries at a time.
Due to rate limiting it should not be run faster than this.

## Results
Three tables are provided as part of the GUI. I think the authors and publications speak for themselves. The edges table represents three
kinds of edge:

1. author connects authors to the publications they wrote.  

2. cite connects one paper to another paper which it cites.

3. citation_checked is a record of which combinations of publication and author have been checked for citations when the 'add citation' button is clicked.

## Export
You can export two kinds of .dot file suitable for use in Gephi and also a human readable list of the citations.
The exportable text appears in a text box at the end of the page.

## Google and rate limiting
This software should be used in compliance with Google's rules. Much as Zotero uses Google Scholar's results pages to populate
it's metadata fields, this seems like a reasonable use of their service.

There is a keys.js where you can provide cookie details, so that you are querying Google as a logged in user. I don't think this adds any particular advantage. 

## Testing locally 
Google Scholar is an HTTPS website, so you can only return data from it using an HTTPS request (browser enforces this). Localhost is not HTTPS. What you need to do is download ngrok (https://ngrok.com/). This will let you proxy requests via an HTTPS website they provide for you. So as far as the browser it concerned, the request will go across HTTPS.

Install ngrok, then run  './ngrok http 3000' from the directory it is downloaded to.

Then you need to edit 

public/bibnet_chrome_extension_testing/content_script.js

and change "var server_url="

To whatever ngrok provided as a proxy address.



