/* global Scrutari */

Scrutari.Client.Ui = {};

Scrutari.Client.Ui.filterChange = function (client) {
    var globalFicheCount = client.scrutariMeta.getGlobalFicheCount();
    var filterState = Scrutari.Client.Ui.buildFilterState(client);
    var filterFicheCount;
    if (filterState.empty) {
        filterFicheCount = client.scrutariMeta.getGlobalFicheCount();
    } else {
        filterFicheCount = -1;
    }
    client.stats.update(filterState);
    if (!_checkFilterFicheCount("base")) {
        if (!_checkFilterFicheCount("corpus")) {
            if (!_checkFilterFicheCount("category")) {
                _checkFilterFicheCount("lang");
            }
        }
    }
    _updateState("base");
    _updateState("corpus");
    _updateState("category");
    _updateState("lang");
    var filterTitlesArray = new Array();
    _addFilterTitles("base", "_ label_base_one", "_ label_base_many");
    _addFilterTitles("corpus", "_ label_corpus_one", "_ label_corpus_many");
    _addFilterTitles("lang", "_ label_lang_one", "_ label_lang_many");
    _addFilterTitles("category", "_ label_category_one", "_ label_category_many");
    var $filterFicheCount = client.$count('stats-filter', 'update', filterFicheCount);
    var $filterValue = Scrutari.$($filterFicheCount, {scrutariRole: "value"});
    if (filterFicheCount === globalFicheCount) {
        $filterValue.removeClass("scrutari-stats-Filter").removeClass("scrutari-stats-None");
        client.$hidden('filter', 'hide');
    } else if (filterFicheCount === 0) {
        $filterValue.removeClass("scrutari-stats-Filter").addClass("scrutari-stats-None");
        client.$hidden('filter', 'show');
    } else {
        $filterValue.addClass("scrutari-stats-Filter").removeClass("scrutari-stats-None");
        client.$hidden('filter', 'show');
    }
    var $filterTitles = Scrutari.$($filterFicheCount, {scrutariRole: "titles"});
    if (filterTitlesArray.length > 0) {
        $filterTitles.html(filterTitlesArray.join(" | "));
    } else {
        $filterTitles.html("");
    }
    
    
    function _checkFilterFicheCount(type) {
        var $stat = Scrutari.$({scrutariStatType: type});
        if ($stat.length > 0) {
            filterFicheCount = 0;
            $stat.each(function (index, element) {
                var key = $(element).data("scrutariStatKey");
                filterFicheCount += client.stats.getFicheCount(type, key);
            });
            return true;
        } else {
            return false;
        }
    }
    
    
    function _updateState(type) {
        Scrutari.$({scrutariStatType: type}).each(function (index, element) {
            var $el = $(element);
            var key = $el.data("scrutariStatKey");
            var ficheCount = client.stats.getFicheCount(type, key);
            var $statTitle = Scrutari.$parents($el, {scrutariRole: "stat-text"});
            if (ficheCount != $el.data("scrutariStatDefault")) {
                if (ficheCount === 0) {
                    $el.html("");
                    $statTitle.addClass("scrutari-panel-Excluded");
                } else {
                    $statTitle.removeClass("scrutari-panel-Excluded");
                    $el.html(client.formatNumber(ficheCount) + " / ");
                }
            } else {
                $el.html("");
                $statTitle.removeClass("scrutari-panel-Excluded");
            }
        });
    }
    
    
    function _addFilterTitles(type, oneLocKey, manyLocKey) {
        var array = filterState.titles[type];
        if (array.length > 0) {
            var locKey = (array.length === 1)?oneLocKey:manyLocKey;
            filterTitlesArray.push(client.loc(locKey) + client.loc('_ colon') + " " + array.join(", "));
        }
    }
    
};


Scrutari.Client.Ui.buildRequestParameters = function (client) {
    var requestParameters = new Object();
    _checkFilter("baselist", "baseEnable", "base");
    _checkFilter("corpuslist", "corpusEnable", "corpus");
    _checkFilter("categorylist", "categoryEnable", "category");
    _checkFilter("langlist", "langEnable", "lang");
    requestParameters["q-mode"] = client.$input_checked("q-mode").val();
    var ponderation = client.$input_checked("ponderation").val();
    if (ponderation === 'date') {
        requestParameters.ponderation = '15,80,5';
    }
    var periode = $.trim(client.$input("periode").val());
    if (periode) {
        requestParameters["flt-date"] = periode;
    }
    if (Scrutari.exists(client.$input_checked("wildchar"))) {
        requestParameters.wildchar = "end";
    } else {
        requestParameters.wildchar = "none";
    }
    return requestParameters;
    
    
    function _checkFilter (paramName, buttonName, inputName) {
        if (client.$button(buttonName).data("scrutariState") === "on") {
            var $inputs = client.$input_checked(inputName);
            var value = "";
            for(var i = 0; i < $inputs.length; i++) {
                if (i > 0) {
                    value += ",";
                }
                value += $inputs[i].value;
            }
            if (value.length > 0) {
                requestParameters[paramName] = value;
            }
        }
    }
    
};

Scrutari.Client.Ui.buildFilterState = function (client) {
    var filterState = new Scrutari.FilterState();
    _check("baseEnable", "base");
    _check("corpusEnable", "corpus");
    _check("categoryEnable", "category");
    _check("langEnable", "lang");
    return filterState;
    
    
    function _check (buttonName, inputName) {
        if (client.$button(buttonName).data("scrutariState") !== "on") {
            return;
        }
        var $inputs = client.$input_checked(inputName);
        var inputLength = $inputs.length;
        if (inputLength === 0) {
            return;
        }
        for(var i = 0; i < $inputs.length; i++) {
            filterState.add(inputName, $inputs[i].value, $($inputs[i]).data("scrutariTitle"));
        }
    }
    
};


Scrutari.Client.Ui.init = function (client) {
    var scrutariMeta = client.scrutariMeta;
    Scrutari.Client.Ui.initHtml(client);
    Scrutari.Client.Ui.initForms(client);
    Scrutari.Client.Ui.initClicks(client);
    Scrutari.Client.Ui.initMainTitle(client);
    client.$count('stats-global', 'update', scrutariMeta.getGlobalFicheCount());
    client.$hidden('init', 'show');
    client.$button('parametersDisplay', 'show');
    var locales = client.scrutariConfig.lang;
    var langArray = scrutariMeta.getLangArray();
    if ((langArray.length > 1) && (Scrutari.exists(client.$panel('lang')))) {
        for(var i = 0, len = langArray.length; i < len; i++) {
            var title = "";
            var code = langArray[i].lang;
            var label = scrutariMeta.getLangLabel(code);
            if (label !== code) {
                title = label;
            }
            langArray[i].title = title;
        }
        var langSortFunction = Scrutari.Utils.getLangSortFunction(client.options.langSort, locales);
        if (langSortFunction) {
            langArray = langArray.sort(langSortFunction);
        }
        Scrutari.Utils.divideIntoColumns(langArray, client.$group("langColumns"), client.getTemplate("lang"));
        client.$panel('lang', 'show');
    }
    if ((scrutariMeta.withCategory()) && (Scrutari.exists(client.$panel('category')))) {
        var categoryArray = scrutariMeta.getCategoryArray(Scrutari.Utils.getCategorySortFunction(client.options.categorySort, locales));
        Scrutari.Utils.divideIntoColumns(categoryArray, client.$group("categoryColumns"), client.getTemplate("category"));
        client.$panel('category', 'show');
    }
    if (client.options.withCorpus) {
        if (Scrutari.exists(client.$panel('corpus'))) {
            var corpusArray =  scrutariMeta.getCorpusArray(Scrutari.Utils.getCorpusSortFunction(client.options.corpusSort, locales));
            if (corpusArray.length > 1) {
                Scrutari.Utils.divideIntoColumns(corpusArray, client.$group("corpusColumns"), client.getTemplate("corpus"));
                client.$panel('corpus', 'show');
            }
        }
    } else {
        if (Scrutari.exists(client.$panel('base'))) {
            var baseArray =  scrutariMeta.getBaseArray(Scrutari.Utils.getBaseSortFunction(client.options.baseSort, locales));
            if (baseArray.length > 1) {
                Scrutari.Utils.divideIntoColumns(baseArray, client.$group("baseColumns"), client.getTemplate("base"));
                client.$panel('base', 'show');
            }
        }
    }
    var initialFilters = client.options.initialFilters;
    if (initialFilters) {
        _initFilter("baselist", "baseEnable", "base");
        _initFilter("corpuslist", "corpusEnable", "corpus");
        _initFilter("categorylist", "categoryEnable", "category");
        _initFilter("langlist", "langEnable", "lang");
    }
    var initialQuery = client.options.initialQuery;
    var initialQId = client.options.initialQId;
    if (initialQuery) {
        var $mainSearchForm = client.$form('mainsearch');
        if (Scrutari.exists($mainSearchForm)) {
            $mainSearchForm.find("input[name='q']").val(initialQuery);
            $mainSearchForm.submit();
        }
    } else if (initialQId) {
         var requestParameters = Scrutari.Client.Ui.buildRequestParameters(client);
        requestParameters["qid"] = initialQId;
        client.$modal("loading", 'show');
        Scrutari.Result.newSearch(client.scrutariConfig, requestParameters, _mainsearchScrutariResultCallback, _mainScrutariErrorCallback);
    }
    
    
    function _initFilter (optionName, buttonName, inputName) {
        if (!initialFilters.hasOwnProperty(optionName)) {
            return;
        }
        Scrutari.Client.Ui.initFilter(client, buttonName, inputName, initialFilters[optionName].split(","));
    }
    
    function _initFilterByQuery (list, buttonName, inputName) {
        if (list) {
            Scrutari.Client.Ui.initFilter(client, buttonName, inputName, list.array);
        }
    }
    
    function _mainsearchScrutariResultCallback (scrutariResult) {
        var $mainSearchForm = client.$form('mainsearch');
        $mainSearchForm.find("input[name='q']").val(scrutariResult.searchMeta.q);
        $mainSearchForm.find("input[name='q-mode'][value='operation']").click();
        var searchOptions = scrutariResult.searchMeta.options;
        if (searchOptions) {
            _initFilterByQuery(searchOptions.baselist, "baseEnable", "base");
            _initFilterByQuery(searchOptions.corpuslist, "corpusEnable", "corpus");
            _initFilterByQuery(searchOptions.categorylist, "categoryEnable", "category");
            _initFilterByQuery(searchOptions.langlist, "langEnable", "lang");
        }
        Scrutari.Client.Result.show(client, scrutariResult, "mainsearch");
        client.$modal("loading", 'hide');
        var $parametersDisplayButton = client.$button('parametersDisplay');
        if ($parametersDisplayButton.data("scrutariState") === "on") {
            $parametersDisplayButton.click();
        }
    }
    
    function _mainScrutariErrorCallback (error) {
        Scrutari.Client.Result.displayError(client, error, "mainsearch");
        client.$modal("loading", 'hide');
    }
        
};

Scrutari.Client.Ui.initHtml = function (client) {
    var includedTexts = {};
    var html = _getText("main");
    html = html.replace(/_ [-_\.a-z0-9]+/g, function(match) {
        return client.loc(match);
    });
    $("#" + client.clientId).html(html);
    
    
    function _getText(name) {
        if (includedTexts.hasOwnProperty(name)) {
            Scrutari.log("Already included: " + name);
            return "";
        } else if (client.ignoreElement(name)) {
            return "";
        } else if ((name === "panel-base") && (client.options.withCorpus)) {
            return "";
        } else if ((name === "panel-corpus") && (!client.options.withCorpus)) {
            return "";
        } else if ((name === "result-share") && (!client.options.permalinkPattern)) {
            return "";
        }
        includedTexts[name] = true;
        var text = client.getStructureHtml(name);
        text = text.replace(/{{([-a-zA-z0-9_]+)}}/g, function (match, p1) {
            return _getText(p1);
        });
        return text;
    }
    
};

Scrutari.Client.Ui.initForms = function (client) {
    client.$form('mainsearch').submit(function () {
        var q = this["q"].value;
        q = $.trim(q);
        if (q.length > 0) {
            var requestParameters = Scrutari.Client.Ui.buildRequestParameters(client);
            requestParameters["log"] = "all";
            requestParameters["q"] = q;
            client.$modal("loading", 'show');
            Scrutari.Result.newSearch(client.scrutariConfig, requestParameters, _mainsearchScrutariResultCallback, _mainScrutariErrorCallback);
        }
        return false;
    });
    client.$form('subsearch').submit(function () {
        var q = this["q"].value;
        q = $.trim(q);
        if ((q.length > 0) && (client.mainCurrentScrutariResult)) {
            var requestParameters = Scrutari.Client.Ui.buildRequestParameters(client);
            requestParameters["q"] = q;
            requestParameters["flt-qid"] = client.mainCurrentScrutariResult.getQId();
            
            client.$modal("loading", 'show');
            Scrutari.Result.newSearch(client.scrutariConfig, requestParameters, _subsearchScrutariResultCallback, _subsearchScrutariErrorCallback);
        }
        return false;
    });
    
    
    function _mainsearchScrutariResultCallback (scrutariResult) {
        Scrutari.Client.Result.show(client, scrutariResult, "mainsearch");
        client.$modal("loading", 'hide');
        var $parametersDisplayButton = client.$button('parametersDisplay');
        if ($parametersDisplayButton.data("scrutariState") === "on") {
            $parametersDisplayButton.click();
        }
    }
    
    function _mainScrutariErrorCallback (error) {
        Scrutari.Client.Result.displayError(client, error, "mainsearch");
        client.$modal("loading", 'hide');
    }
    
    function _subsearchScrutariResultCallback (scrutariResult) {
        Scrutari.Client.Result.show(client, scrutariResult, "subsearch");
        client.$modal("loading", 'hide');
    }
            
    function _subsearchScrutariErrorCallback (error) {
        Scrutari.Client.Result.displayError(client, error, "subsearch");
        client.$modal("loading", 'hide');
    }
    
};

Scrutari.Client.Ui.initClicks = function (client) {
    $("#" + client.clientId).on("click", Scrutari.toCssQuery({scrutariButton: true}), function () {
        var $this = $(this);
        var action = $this.data("scrutariButton");
        switch(action) {
            case 'langEnable':
                 _enablePanel($this, "lang");
                break;
            case 'langCheckAll':
                _checkAll("lang");
                break;
            case 'langUncheckAll':
                _uncheckAll("lang");
                break;
            case 'categoryEnable':
                 _enablePanel($(this), "category");
                break;
            case 'categoryCheckAll':
                _checkAll("category");
                break;
            case 'categoryUncheckAll':
                _uncheckAll("category");
                break;
            case 'corpusEnable':
                 _enablePanel($this, "corpus");
                break;
            case 'corpusCheckAll':
                _checkAll("corpus");
                break;
            case 'corpusUncheckAll':
                _uncheckAll("corpus");
                break;
            case 'baseEnable':
                _enablePanel($this, "base");
                break;
            case 'baseCheckAll':
                _checkAll("base");
                break;
            case 'baseUncheckAll':
                _uncheckAll("base");
                break;
            case 'modeHelp':
                client.$modal("help_mode", 'show');
                break;
            case 'ponderationHelp':
                client.$modal("help_ponderation", 'show');
                break;
            case 'periodeHelp':
                client.$modal("help_periode", 'show');
                break;
            case 'parametersDisplay':
                var state = Scrutari.Utils.toggle($this, "scrutariState");
                Scrutari.Utils.toggle.classes($this, state,  "Scrutari-On", "");
                if (state === 'on') {
                    client.$area('parameters', 'show');
                } else {
                    client.$area('parameters', 'hide');
                }
                break;
            case 'blockDisplay':
                if (Scrutari.Utils.toggle($this, "scrutariState") === 'on') {
                    client.$block($this.data("scrutariTarget"), 'show');
                } else {
                    client.$block($this.data("scrutariTarget"), 'hide');
                }
                 break;
            case 'removeHistory':
                var historyName = $this.data("scrutariHistoryName");
                if (historyName) {
                    _removeHistory(historyName);
                }
                break;
            case 'loadHistory':
                var historyName = $this.data("scrutariHistoryName");
                if (historyName) {
                    _loadHistory(historyName);
                }
                break;
            case 'categoryTab':
                _categoryTab($(this));
                break;
            case 'ficheTab':
                _ficheTab($(this));
                break;
            default:
                Scrutari.log("Unknown action: " + action);
        }
        if ((this.tagName) && (this.tagName.toLowerCase()  === 'a')) {
            return false;
        }
    });
    $("#" + client.clientId).on("click", "input", function () {
        var name = this.name;
        if (name) {
            switch(name) {
                case 'q-mode':
                    if (this.value === 'operation') {
                        Scrutari.Utils.disable("input[name='wildchar']");
                    } else {
                        Scrutari.Utils.enable("input[name='wildchar']");
                    }
                    break;
                case 'lang':
                case 'category':
                case 'base':
                case 'corpus':
                    _checkClick(name);
                    break;
            }
        }
    });
    
    
    function _checkClick (type) {
        var $button = client.$button(type + 'Enable');
        if ($button.data('scrutariState') === 'off') {
            $button.click();
            $(this).focus();
        } else {
            Scrutari.Client.Ui.filterChange(client);
        }
    }
    
    function _checkAll (type) {
        Scrutari.Utils.check("input[name='" + type + "']");
        Scrutari.Client.Ui.filterChange(client);
    }
    
    function _uncheckAll (type) {
        Scrutari.Utils.uncheck("input[name='" + type + "']");
        Scrutari.Client.Ui.filterChange(client);
    }
    
    function _enablePanel ($button, type, selector) {
        var state = Scrutari.Utils.toggle($button, "scrutariState");
        Scrutari.Utils.toggle.classes($button, state, "scrutari-On", "");
        client.$button(type + "CheckAll", state);
        client.$button(type + "UncheckAll", state);
        Scrutari.Utils.toggle.classes(client.$group(type + "Columns"), state, "", "scrutari-panel-ColumnDisabled");
        Scrutari.Utils.toggle.text($button.children("span"), "scrutariAlternate");
        var $filterLabel = client.$label(type + "Filter");
        Scrutari.Utils.toggle.text($filterLabel, "scrutariAlternate");
        Scrutari.Utils.toggle.classes($filterLabel, state, "scrutari-panel-Active", "scrutari-Disabled");
        Scrutari.Client.Ui.filterChange(client);
    }
    
    function _removeHistory (historyName) {
        client.unstoreResult(historyName);
        client.$block(historyName).remove();
    }
    
    function _loadHistory (historyName) {
        Scrutari.Client.Result.loadHistory(client, historyName);
    }
    
    function _categoryTab ($button) {
        var categoryName = $button.data("scrutariCategory");
        Scrutari.$({scrutariRole: "category-content"}).each(function (index, element) {
            var $element = $(element);
            if ($element.data("scrutariCategory") === categoryName) {
                client.show($element);
            } else {
                client.hide($element);
            }
        });
        Scrutari.$({scrutariRole: "category-tab"}).each(function (index, element) {
            var $element = $(element);
            if ($element.data("scrutariCategory") === categoryName) {
                $element.addClass("scrutari-On");
            } else {
                $element.removeClass("scrutari-On");
            }
        });
    }
    
    function _ficheTab ($button) {
        var newPaginationNumber = parseInt($button.data("scrutariNumber"));
        if ($button.data("scrutariType") === "unique") {
            Scrutari.Client.Result.uniquePaginationChange(client, newPaginationNumber);
        } else {
            Scrutari.Client.Result.categoryPaginationChange(client, $button.data("scrutariCategory"), newPaginationNumber);
        }
        if ($button.data("scrutariPosition") === "bottom") {
             client.scrollToResult();
        }
    }
    
};

Scrutari.Client.Ui.initMainTitle = function (client) {
    var html = "";
    var mainTitle = client.options.mainTitle;
    if ((mainTitle) || (mainTitle === "")) {
        if ($.isFunction(mainTitle)) {
            html = mainTitle(client);
        } else {
            html = mainTitle;
        }
    } else {
        html += client.loc('_ title_main');
        html += " – ";
        var title = client.scrutariMeta.getTitle();
        if (title) {
            html += Scrutari.escape(title);
        } else {
            html += "[";
            html += client.scrutariConfig.name;
            html += "]";
        }
    }
    client.$title('main').html(html);
};

Scrutari.Client.Ui.initFilter = function (client, buttonName, inputName, checkedArray) {
    var done = false;
    for(var i = 0, len = checkedArray.length; i < len; i++) {
        var $input = client.$input(inputName, checkedArray[i]);
        if ($input.length > 0) {
            $input.prop("checked", true);
            done = true;
        }
    }
    if (done) {
        client.$button(buttonName).click();
    }  
};