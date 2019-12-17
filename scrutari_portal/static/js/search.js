function initCallback(client) {
    var historyBlock = client.$block("historyList")[0];
    if (!historyBlock) {
        return;
    }
    var observer = new MutationObserver(_updateHref);
    observer.observe(historyBlock, {childList: true});
    _updateHref();
    
    function _updateHref() {
        let $historyList = $(historyBlock).children("div");
        let qidArray = new Array();
        $historyList.each(function (index, element) {
                let name = $(element).data("scrutariBlock");
                let scrutariResult = client.getResult(name);
                if (scrutariResult) {
                    qidArray.push(scrutariResult.getQId());
                }
        });
        $("[data-custom='graph']").attr("href", "graph.php?qid=" + qidArray.join(","));
    }
}
  
