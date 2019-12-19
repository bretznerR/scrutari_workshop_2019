document.addEventListener("DOMContentLoaded",initTimer);

function initTimer() {
	setTimeout(() => {
		var totalTopArticles = $("#scrutari-top-articles").children().length
		var initialHeight = 85;
		var nextTopArticleHeight = initialHeight;
		var timer = setInterval(()=> {
			nextTopArticleHeight = (nextTopArticleHeight + 85) % (totalTopArticles * 85); 
			console.log(nextTopArticleHeight)
			$('#scrutari-top-articles').animate({scrollTop: nextTopArticleHeight}, 800); 
		}, 4000)
	},2000);
	setTimeout(() => {
		var totalLastArticles = $("#scrutari-last-articles").children().length
		var initialHeight = 85;
		var nextLastArticleHeight = initialHeight;
		var timer = setInterval(()=> {
			nextLastArticleHeight = (nextLastArticleHeight + 85) % (totalLastArticles * 85); 
			console.log(nextLastArticleHeight)
			$('#scrutari-last-articles').animate({scrollTop: nextLastArticleHeight}, 800); 
		}, 3000)
	},2000);
}