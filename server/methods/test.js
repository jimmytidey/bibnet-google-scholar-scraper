bibnet = {}; 

Meteor.methods({
	test: function (list) {
		var list = ['ostrom governmeing the commons', 'mancur olson collective action']; 

		_.each(list, function(val, key){ 
			Meteor.setTimeout(function(val){

			}, delay)


		})
	}
});



bibnet.getPaperFromSearch = function(search_string) { 

	console.log('looking for paper with string: ', val)

	result = HTTP.call('GET',"https://scholar.google.co.uk/scholar?hl=en&q=" + val);
	$ = cheerio.load(result.content);


	var author_link  = $('#gs_ccl_results div:first-child .gs_a a').attr('href');
	var author_name  = $('#gs_ccl_results div:first-child .gs_a').text().split(' -')[0];

	if(author_link) { 
      //add author 
   } else { 

   }

   var cite_link  = $('#gs_ccl_results div:first-child .gs_fl a').attr('href');
}

bibnet.insertAuthorFromId = function(id) { 


}

bibnet.insertAuthorFromName = function(name) { 


}

bibnet.insertPaper = function(cluster_id) { 


}