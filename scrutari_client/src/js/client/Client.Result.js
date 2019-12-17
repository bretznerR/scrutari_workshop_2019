/* global Scrutari */

Scrutari.Client.Result = {};

Scrutari.Client.Result.show = function (client, scrutariResult, searchOrigin) {
    client.$hidden("start", 'show');
    var ficheCount = scrutariResult.getFicheCount();
    client.$count('stats-result', 'update', ficheCount);
    var $ficheDisplayBlock = client.$block('ficheDisplay');
    $ficheDisplayBlock.empty();
    client.currentScrutariResult = scrutariResult;
    if (searchOrigin === "mainsearch") {
        Scrutari.Client.Result.setCurrentMain(client, scrutariResult);
        Scrutari.Client.Result.addToHistory(client, scrutariResult);
    } else if (searchOrigin === "subsearch") {
        var subsearchText =  "+ " + Scrutari.Utils.formatSearchSequence(client, scrutariResult) + " = " + scrutariResult.getFicheCount();
        if (client.currentHistoryName) {
            Scrutari.$(client.$block(client.currentHistoryName), {scrutariRole: "subsearch"}).text(subsearchText);
        }
    }
    if (ficheCount === 0) {
        client.$hidden("empty", 'hide');
        var withFilter;
        if (searchOrigin === "subsearch") {
            withFilter = true;
        } else {
            withFilter = _hasFilter(scrutariResult.requestParameters);
        }
        $ficheDisplayBlock.html(client.render("emptyfichedisplay", {withFilter: withFilter, scrutariResult: scrutariResult}));
        return;
    }
    client.$hidden("empty", 'show');
    if (ficheCount >= client.scrutariConfig.options.subsearchThreshold) {
        client.$hidden("threshold", 'show');
    } else {
        client.$hidden("threshold", 'hide');
    }
    var qId = scrutariResult.getQId();
    var permalink = client.toPermalink(qId);
    if (permalink) {
        client.$link('permalink').attr("href", permalink).html(permalink);
    }
    _updateDownloadHref("ods");
    _updateDownloadHref("csv");
    _updateDownloadHref("atom");
    if (scrutariResult.getFicheGroupType() === 'category') {
        var contextObj = {
            scrutariResult: scrutariResult,
            array: new Array()
        };
        var categoryCount = scrutariResult.getCategoryCount();
        for(var i = 0; i < categoryCount; i++) {
            var category = scrutariResult.getCategory(i);
            var metaCategory = client.scrutariMeta.getCategory(category.name);
            if (metaCategory) {
                category = metaCategory;
            } else {
                category.phraseMap = {};
                category.attrMap = {};
            }
            contextObj.array.push({
                category: category,
                active: (i === 0),
                fichestat: scrutariResult.getCategoryFicheCount(i)
            });
        }
        $ficheDisplayBlock.html(client.render("categoryfichedisplay", contextObj));
        for(var i = 0; i < categoryCount; i++) {
            var category = scrutariResult.getCategory(i);
            Scrutari.Client.Result.categoryPaginationChange(client, category.name, 1);
        }
    } else {
        $ficheDisplayBlock.html(client.render("uniquefichedisplay", {scrutariResult: scrutariResult}));
        Scrutari.Client.Result.uniquePaginationChange(client, 1);
    }
    
    
    function _updateDownloadHref(extension) {
        client.$link(extension).attr("href", client.scrutariConfig.getDownloadUrl(qId, extension));
    }
    
    
    function _hasFilter(requestParameters) {
        for(var prop in requestParameters) {
            switch(prop) {
                case "baselist":
                case "corpuslist":
                case "categorylist":
                case "langlist":
                    var value = requestParameters[prop];
                    if (value) {
                        return true;
                    }
            }
            if (prop.indexOf("flt") === 0) {
                return true;
            }
        }
        return false;
    }
    
};

Scrutari.Client.Result.displayError = function (client, error, searchOrigin) {
    if (error.parameter !== "q") {
        Scrutari.logError(error);
        return;
    }
    var title =  client.loc(error.key);
    if (title !== error.key) {
        var alertMessage = title;
        if (error.hasOwnProperty("array"))  {
            alertMessage += client.loc('_ colon');
            for(var i = 0; i < error.array.length; i++) {
                alertMessage += "\n";
                var obj = error.array[i];
                alertMessage += "- ";
                alertMessage += client.loc(obj.key);
                if (obj.hasOwnProperty("value")) {
                    alertMessage += client.loc('_ colon');
                    alertMessage += " ";
                    alertMessage += obj.value;
                }
            }
        }
        alert(alertMessage);
    } else {
        Scrutari.logError(error);
    }
};

Scrutari.Client.Result.uniquePaginationChange = function (client, paginationNumber) {
    var paginationLength = client.scrutariConfig.options.paginationLength;
    var scrutariResult = client.currentScrutariResult;
    var html = "";
    if (!scrutariResult.isUniquePaginationLoaded(paginationLength, paginationNumber)) {
        if (client.isWaiting) {
            return;
        }
        client.$block("fiches").html(client.render("ficheloading", {scrutariResult: scrutariResult}));
        client.isWaiting = true;
        scrutariResult.loadUniquePagination(client.scrutariConfig, paginationLength, paginationNumber, _paginationCallback);
        return;
    }
    var paginationFicheArray = scrutariResult.selectUniqueFicheArray(paginationLength, paginationNumber);
    var ficheTemplate =  client.getTemplate("fiche");
    for(var i = 0; i < paginationFicheArray.length; i++) {
        html += ficheTemplate(scrutariResult.completeFiche(paginationFicheArray[i], client.scrutariMeta, client.options));
    }
    client.$block("fiches").html(html);
    var tabArray = Scrutari.Utils.getTabArray(scrutariResult.getFicheCount(), paginationLength, paginationNumber);
    var template = client.getTemplate("tabs");
    client.$block("topPagination").html(template({
       tabArray: tabArray,
       type: "unique",
       position: "top"
    }));
    client.$block("bottomPagination").html(template({
       tabArray: tabArray,
       type: "unique",
       position: "bottom"
    }));
    if (client.options.paginationChangeCallback) {
        client.options.paginationChangeCallback(client, paginationFicheArray, {paginationNumber:paginationNumber});
    }
    
    
    function _paginationCallback () {
        client.isWaiting = false;
        Scrutari.Client.Result.uniquePaginationChange(client, paginationNumber);
    }
        
};
    
Scrutari.Client.Result.categoryPaginationChange = function (client, categoryName, paginationNumber) {
    var paginationLength = client.scrutariConfig.options.paginationLength;
    var scrutariResult = client.currentScrutariResult;
    var html = "";
    if (!scrutariResult.isCategoryPaginationLoaded(categoryName, paginationLength, paginationNumber)) {
        client.$block("fiches_" + categoryName).html(client.render("ficheloading", {scrutariResult: scrutariResult}));
        if (client.isWaiting) {
            return;
        }
        client.isWaiting = true;
        scrutariResult.loadCategoryPagination(client.scrutariConfig, categoryName, paginationLength, paginationNumber, _paginationCallback);
        return;
    }
    var paginationFicheArray = scrutariResult.selectCategoryFicheArray(categoryName, paginationLength, paginationNumber);
    var ficheTemplate =  client.getTemplate("fiche");
    for(var i = 0; i < paginationFicheArray.length; i++) {
        html += ficheTemplate(scrutariResult.completeFiche(paginationFicheArray[i], client.scrutariMeta, client.options));
    }
    client.$block("fiches_" + categoryName).html(html);
    var tabArray = Scrutari.Utils.getTabArray(scrutariResult.getCategoryFicheCountbyName(categoryName), paginationLength, paginationNumber);
    var template = client.getTemplate("tabs");
    client.$block("topPagination_" + categoryName).html(template({
       tabArray: tabArray,
       type: "category",
       category: categoryName,
       position: "top"
    }));
    client.$block("bottomPagination_" + categoryName).html(template({
       tabArray: tabArray,
       type: "category",
       category: categoryName,
       position: "bottom"
    }));
    if (client.options.paginationChangeCallback) {
        client.options.paginationChangeCallback(client, paginationFicheArray, {categoryName: categoryName, paginationNumber:paginationNumber});
    }
    
    
    function _paginationCallback () {
        client.isWaiting = false;
        Scrutari.Client.Result.categoryPaginationChange(client, categoryName, paginationNumber);
    }
    
};

Scrutari.Client.Result.addToHistory = function (client, scrutariResult) {
    var $historyListBlock = client.$block("historyList");
    if (!Scrutari.exists($historyListBlock)) {
        return;
    }
    if (client.currentHistoryName) {
        var $historyBlock = client.$block(client.currentHistoryName);
        $historyBlock.removeClass("scrutari-history-Active");
        Scrutari.$($historyBlock, {scrutariRole: "subsearch"}).empty();
        client.show(Scrutari.$($historyBlock, {scrutariRole: "remove"}));
    }
    var historyName = "history_" + client.newHistoryNumber();
    Scrutari.Client.Result.setCurrentHistory(client, historyName);
    client.storeResult(historyName, scrutariResult);
    var contextObj = {
        scrutariResult: scrutariResult,
        name: historyName,
        fichestat: scrutariResult.getFicheCount(),
        sequence: Scrutari.Utils.formatSearchSequence(client, scrutariResult)
    };
    $historyListBlock.prepend(client.render("history", contextObj));
};

Scrutari.Client.Result.loadHistory = function (client, historyName) {
    var historyScrutariResult = client.getResult(historyName);
    if (historyScrutariResult) {
        var $historyBlock = client.$block(historyName);
        client.currentScrutariResult = historyScrutariResult;
        Scrutari.Client.Result.setCurrentMain(client, historyScrutariResult);
        Scrutari.Client.Result.setCurrentHistory(client, historyName);
        $historyBlock.addClass("scrutari-history-Active");
        client.hide(Scrutari.$($historyBlock, {scrutariRole: "remove"}));
        Scrutari.Client.Result.show(client, historyScrutariResult);
    }
};
    
Scrutari.Client.Result.setCurrentHistory = function (client, historyName) {
    if (client.currentHistoryName) {
        var $historyBlock = client.$block(client.currentHistoryName);
        $historyBlock.removeClass("scrutari-history-Active");
        Scrutari.$($historyBlock, {scrutariRole: "subsearch"}).empty();
        client.show (Scrutari.$($historyBlock, {scrutariRole: "remove"}));
    }
    client.currentHistoryName = historyName; 
};

Scrutari.Client.Result.setCurrentMain = function (client, scrutariResult) {
    client.mainCurrentScrutariResult = scrutariResult;
    client.$block("currentSearchSequence").text(Scrutari.Utils.formatSearchSequence(client, scrutariResult) + " (" + scrutariResult.getFicheCount() + ")");
};

