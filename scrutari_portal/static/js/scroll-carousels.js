document.addEventListener("DOMContentLoaded",initAutoScrollBehavior);


function initAutoScrollBehavior() {

	var timerTop = setTimeout(() => {
		var totalTopArticles = $("#scrutari-top-articles").children().length
		var initialHeight = 85;
		var nextTopArticleHeight = initialHeight;
		var timer = setInterval(()=> {
			var currentOffsetTop = $("#scrutari-top-articles").scrollTop()
			nextTopArticleHeight = (currentOffsetTop == nextTopArticleHeight)? nextTopArticleHeight + 85 : findNextPosition(currentOffsetTop, initialHeight, totalTopArticles * 85)
			$('#scrutari-top-articles').animate({scrollTop: nextTopArticleHeight}, 800); 
		}, 4000)
	},2000);

	var timerLast = setTimeout(() => {
		var totalLastArticles = $("#scrutari-last-articles").children().length
		var initialHeight = 85;
		var nextLastArticleHeight = initialHeight;
		var timer = setInterval(()=> {
			var currentOffsetTop = $("#scrutari-last-articles").scrollTop();
			nextLastArticleHeight = (currentOffsetTop == nextLastArticleHeight)? nextLastArticleHeight + 85 : findNextPosition(currentOffsetTop, initialHeight, totalLastArticles * 85)
			$('#scrutari-last-articles').animate({scrollTop: nextLastArticleHeight}, 800); 
		}, 3000)
	},2000);
}

function findNextPosition(value, gap, max) {
	initialGap = gap;
	if(value <= max) {
		while(value > initialGap) {
			initialGap += gap;
		}
		return initialGap;
	}
} 