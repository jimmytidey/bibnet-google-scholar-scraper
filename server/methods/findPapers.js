Meteor.methods({
	findPapers: function (list_of_papers) {
		
		console.log('find papers called'); 

		//list_of_papers = 'ostrom governing the commons \n mancur olson the logic of collective action \n ostrom and hess'
		/* 

		steven lukes power a radical view
		amartya sen the idea of justice
		ostrom governing the commons 
		mancur olson the logic of collective action 
		gordon tullock the calculus of consent
		*/ 

		bibnet.list_of_papers = list_of_papers.split(/\n/)

		bibnet.paperSearchTimer = Meteor.setInterval(function(){
			
			if (bibnet.list_of_papers.length > 0) {
				var paper_description_string = bibnet.list_of_papers.pop(); 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH FOR: ', paper_description_string )
				bibnet.SearchForPublications(paper_description_string);
			} else { 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH ENDED');
				Meteor.clearInterval(bibnet.paperSearchTimer);
			}
		}, (Math.random() * 10000) + 2000) 
	}
});
