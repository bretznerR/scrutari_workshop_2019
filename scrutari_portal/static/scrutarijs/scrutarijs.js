/* version: 1.0.1 */
var Scrutari = {};
Scrutari.log = function (msg) {
    if ((console) && (console.log)) {
        console.log(msg);
    }
};
Scrutari.logError = function (error) {
    var errorMessage = "Scrutari Request Error [key = " + error.key + " | parameter = " + error.parameter;
    if (error.hasOwnProperty("value")) {
        errorMessage += " | value = " + error.value;
    }
    if (error.hasOwnProperty("array")) {
        errorMessage += " | array = (";
        for(var i = 0; i < error.array.length; i++) {
            if (i > 0) {
                errorMessage += ";";
            }
            var obj = error.array[i];
            errorMessage += obj.key;
            if (obj.hasOwnProperty("value")) {
                errorMessage += "=" + obj.value;
            }
        }
        errorMessage += ")";
    }
    errorMessage += "}";
    Scrutari.log(errorMessage);
};
Scrutari.convert = function (jqArgument) {
    if (jqArgument.jquery) {
        return jqArgument;
    } else {
        return $(jqArgument);
    }
};
Scrutari.exists = function (jqArgument) {
    return Scrutari.convert(jqArgument).length > 0;
};
 Scrutari.escape = function (text) {
     var result = "";
    for(var i = 0; i < text.length; i++) {
        carac = text.charAt(i);
        switch (carac) {
            case '&':
                result += "&amp;";
                break;
            case '"':
                result += "&quot;";
                break;
            case '<':
                result += "&lt;";
                break;
            case '>':
                result += "&gt;";
                break;
            case '\'':
                result += "&#x27;";
                break;
            default:
                result += carac;
        }
    }
    return result;
 };
 Scrutari.$ = function (jqArgument, properties) {
    if (!properties) {
        properties = jqArgument;
        jqArgument = null;
    }
    var query = Scrutari.toCssQuery(properties);
    if (jqArgument) {
         return Scrutari.convert(jqArgument).find(query);
    } else {
         return $(query);
    }
};
Scrutari.$children = function (jqArgument, properties) {
    return Scrutari.convert(jqArgument).children(Scrutari.toCssQuery(properties));
};
Scrutari.$parents = function (jqArgument, properties) {
    return Scrutari.convert(jqArgument).parents(Scrutari.toCssQuery(properties));
};
Scrutari.toCssQuery = function (properties) {
    var query = "";
    var elementName = false;
    var suffix = "";
    for(let key in properties) {
        let value = properties[key];
         if (!key.startsWith("_")) {
             if (value === true) {
                 query += "[" + Scrutari.toDataAttribute(key) + "]";
             } else {
                 query += "[" + Scrutari.toDataAttribute(key) + "='" + value + "']";
             }
         } else if (key === "_checked") {
             if (value) {
                suffix += ":checked";
            } else {
                suffix += ":not(:checked)";
            }
         } else if (key === "_type") {
             query += "[type='" + value + "']";
         } else if (key === "_name") {
             query += "[name='" + value + "']";
         } else if (key === "_value") {
             query += "[value='" + value + "']";
         } else if (key === "_element") {
             elementName = value;
         }
     }
     if (elementName) {
         query = elementName + query;
     }
     query += suffix;
     return query;
};
Scrutari.toDataAttribute = function (camelCaseString) {
    return "data-" + camelCaseString.replace(/[A-Z]/g, function (upperLetter) {
        return "-" + upperLetter.toLowerCase();
    });
};
Scrutari.Config = function (name, engineUrl, lang, origin, options) {
    this.name = name;
    this.engineUrl = engineUrl;
    this.lang = lang;
    this.origin = origin;
    this.options = {
        dataType: "json",
        queryVariant: "query",
        ficheFields: "",
        motcleFields: "",
        paginationLength: 50,
        subsearchThreshold: 250,
        groupSortFunction: Scrutari.Config.FicheCountGroupSortFunction
    };
    if (options) {
        for(var key in options) {
            this.options[key] = options[key];
        }
    }
};
Scrutari.Config.prototype.getJsonUrl = function () {
    return this.engineUrl + "json";
};
Scrutari.Config.prototype.getDownloadUrl = function (qId, extension) {
    switch(extension) {
        case "ods":
        case "csv":
            return this.engineUrl + "export/" +  "result_" + qId + "_" + this.lang + "." + extension;
        case "atom":
            return this.engineUrl + "feed/" + "fiches_" + this.lang + ".atom?qid=" + qId + "&all=" + _getCurrentDate();
        default:
            Scrutari.log("Unknown extension: " + extension);
            return "";
    }
    function _getCurrentDate() {
        var date = new Date();
        var dateString = date.getFullYear() + "-";
        var mois = date.getMonth() + 1;
        if (mois < 10) {
            dateString += "0";
        }
        dateString += mois;
        dateString += "-";
        var jour = date.getDate();
        if (jour < 10) {
            dateString += "0";
        }
        dateString += jour;
        return dateString;
    }
};
Scrutari.Config.prototype.getPermalinkUrl = function (qId, permalinkPattern) {
    var permalink = permalinkPattern.replace("$LANG", this.lang);
    permalink = permalink.replace("$QID", qId);
    return permalink;
};
Scrutari.Config.FicheCountGroupSortFunction = function (group1, group2) {
    var count1 = group1.ficheCount;
    var count2 = group2.ficheCount;
    if (count1 > count2) {
        return -1;
    } else if (count1 < count2) {
        return 1;
    } else {
        var rank1 = group1.category.rank;
        var rank2 = group1.category.rank;
        if (rank1 < rank2) {
            return -1;
        } else if (rank1 > rank2) {
            return 1;
        } else {
            return 0;
        }
    }
};
Scrutari.Ajax = {};
Scrutari.Ajax.loadBaseArray = function (scrutariConfig, requestParameters, baseArrayCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "base";
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "baseArray", baseArrayCallback);
        }
    });
};
Scrutari.Ajax.loadCorpusArray = function (scrutariConfig, requestParameters, corpusArrayCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "corpus";
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "corpusArray", corpusArrayCallback);
        }
    });
};
Scrutari.Ajax.loadThesaurusArray = function (scrutariConfig, requestParameters, thesaurusArrayCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "thesaurus";
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "thesaurusArray", thesaurusArrayCallback);
        }
    });
};
Scrutari.Ajax.loadMotcleArray = function (scrutariConfig, requestParameters, motcleArrayCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "motcle";
    Scrutari.Ajax.check(requestParameters, "fieldvariant", "data");
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "motcleArray", motcleArrayCallback);
        }
    });
};
Scrutari.Ajax.loadFicheArray = function (scrutariConfig, requestParameters, ficheArrayCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "fiche";
    Scrutari.Ajax.check(requestParameters, "fieldvariant", "data");
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "ficheArray", ficheArrayCallback);
        }
    });
};
Scrutari.Ajax.loadCategoryArray = function (scrutariConfig, requestParameters, categoryArrayCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "category";
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "categoryArray", categoryArrayCallback);
        }
    });
};
Scrutari.Ajax.loadEngineInfo = function (scrutariConfig, requestParameters, engineInfoCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "engine";
    Scrutari.Ajax.check(requestParameters, "info", "all");
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "engineInfo", engineInfoCallback);
        }
    });
};
Scrutari.Ajax.loadFicheSearchResult = function (scrutariConfig, requestParameters, ficheSearchResultCallback, apiErrorCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "q-fiche";
    if ((scrutariConfig.options.ficheFields) || (scrutariConfig.options.motcleFields)) {
        Scrutari.Ajax.check(requestParameters, "fichefields", scrutariConfig.options.ficheFields);
        Scrutari.Ajax.check(requestParameters, "motclefields", scrutariConfig.options.motcleFields);
    }
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "fieldvariant", scrutariConfig.options.queryVariant);
    Scrutari.Ajax.check(requestParameters, "q-mode", "intersection");
    Scrutari.Ajax.check(requestParameters, "origin", scrutariConfig.origin);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    Scrutari.Ajax.check(requestParameters, "start", 1);
    Scrutari.Ajax.check(requestParameters, "limit", scrutariConfig.options.paginationLength * 2);
    Scrutari.Ajax.check(requestParameters, "starttype", "in_all");
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "ficheSearchResult", ficheSearchResultCallback, apiErrorCallback);
        }
    });
};
Scrutari.Ajax.loadExistingFicheSearchResult = function (scrutariConfig, requestParameters, existingFicheSearchResultCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "q-fiche";
    if ((scrutariConfig.options.ficheFields) || (scrutariConfig.options.motcleFields)) {
        Scrutari.Ajax.check(requestParameters, "fichefields", scrutariConfig.options.ficheFields);
        Scrutari.Ajax.check(requestParameters, "motclefields", scrutariConfig.options.motcleFields);
    }
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "fieldvariant", scrutariConfig.options.queryVariant);
    Scrutari.Ajax.check(requestParameters, "insert", "-searchmeta,-motclearray");
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    Scrutari.Ajax.check(requestParameters, "start", 1);
    Scrutari.Ajax.check(requestParameters, "limit", scrutariConfig.options.paginationLength * 2);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            Scrutari.Ajax.success(data, "ficheSearchResult", existingFicheSearchResultCallback);
        }
    });
};
Scrutari.Ajax.loadGeoJson = function (scrutariConfig, requestParameters, geojsonCallback, apiErrorCallback) {
    if (!requestParameters) {
        requestParameters = new Object();
    }
    requestParameters.type = "geojson";
    if ((scrutariConfig.options.ficheFields) || (scrutariConfig.options.motcleFields)) {
        Scrutari.Ajax.check(requestParameters, "fichefields", scrutariConfig.options.ficheFields);
        Scrutari.Ajax.check(requestParameters, "motclefields", scrutariConfig.options.motcleFields);
    }
    Scrutari.Ajax.check(requestParameters, "lang", scrutariConfig.lang);
    Scrutari.Ajax.check(requestParameters, "fieldvariant", scrutariConfig.options.queryVariant);
    Scrutari.Ajax.check(requestParameters, "origin", scrutariConfig.origin);
    Scrutari.Ajax.check(requestParameters, "warnings", 1);
    Scrutari.Ajax.check(requestParameters, "version", 3);
    $.ajax({
        url: scrutariConfig.getJsonUrl(),
        dataType: scrutariConfig.options.dataType,
        data: requestParameters,
        success: function (data, textStatus) {
            if (data.hasOwnProperty("error")) {
                if (apiErrorCallback) {
                    apiErrorCallback(data.error);
                } else {
                    Scrutari.logError(data.error);
                }
            } else {
                Scrutari.Ajax.logWarnings(data);
                geojsonCallback(data);
            }
        }
    });
};
Scrutari.Ajax.success = function(ajaxResult, objectName, objectCallback, apiErrorCallback) {
    if (ajaxResult.hasOwnProperty("error")) {
        if (apiErrorCallback) {
            apiErrorCallback(ajaxResult.error);
        } else {
            Scrutari.logError(ajaxResult.error);
        }
    } else {
        Scrutari.Ajax.logWarnings(ajaxResult);
        if (!ajaxResult.hasOwnProperty(objectName)) {
            $.error(objectName + " object is missing in json response");
        } else {
            objectCallback(ajaxResult[objectName]);
        }
    }
};
Scrutari.Ajax.logWarnings = function (ajaxResult) {
    if (ajaxResult.hasOwnProperty("warnings")) {
        var warningsMessage = "Scrutari Request Warnings [";
        for(var i = 0; i < ajaxResult.warnings.length; i++) {
            if (i > 0) {
                warningsMessage += ";";
            }
            var warning = ajaxResult.warnings[i];
            warningsMessage += "key = ";
            warningsMessage += warning.key;
            warningsMessage += " | parameter = ";
            warningsMessage += warning.parameter;
            if (warning.hasOwnProperty("value")) {
                warningsMessage += " | value = ";
                warningsMessage += warning.value;
            }
        }
        warningsMessage += "]";
        Scrutari.log(warningsMessage);
    }
};
Scrutari.Ajax.check = function (obj, name, defaultValue) {
    if (!obj.hasOwnProperty(name)) {
        if (defaultValue) {
            obj[name] = defaultValue;
        } else {
            obj[name] = "";
        }
    }
};
Scrutari.Meta = function (engineInfo) {
    this.engineInfo = engineInfo;
};
Scrutari.Meta.load = function(scrutariConfig, callback) {
    var buffer = new Object();
    var _ajaxEnd = function() {
        var scrutariMeta = new Scrutari.Meta(buffer.engineInfo);
        if (callback) {
            callback(scrutariMeta);
        }
    };
    var _engineInfoCallback = function (engineInfo) {
        buffer.engineInfo = engineInfo;
        _ajaxEnd();
    };
    Scrutari.Ajax.loadEngineInfo(scrutariConfig, null, _engineInfoCallback);
};
Scrutari.Meta.prototype.getEngineInfo = function () {
    return this.engineInfo;
};
Scrutari.Meta.prototype.getTitle = function () {
    return this.engineInfo.metadata.title;
};
Scrutari.Meta.prototype.getDefaultOptions = function () {
    var options = {};
    var attrMap = this.engineInfo.metadata.attrMap;
    for(var key in attrMap) {
        if (key.indexOf("scrutarijs:") === 0) {
            var name = key.substring("scrutarijs:".length);
            var values = attrMap[key];
            if (values.length === 1) {
                var value = values[0];
                if (value === "false") {
                    value = false;
                } else if (value === "true") {
                    value = true;
                }
                options[name] = value;
            } else {
                options[name] = values;
            }
        }
        this[key] = options[key];
    }
    return options;
};
Scrutari.Meta.prototype.getGlobalFicheCount = function () {
    return this.engineInfo.stats.fiche;
};
Scrutari.Meta.prototype.getGlobalLangFicheCount = function (langArray) {
    var ficheCount = 0;
    var length = this.engineInfo.stats.langArray.length;
    for(var i = 0; i < length; i++) {
        var langObj = this.engineInfo.stats.langArray[i];
        if ($.inArray(langObj.lang, langArray) !== -1) {
            ficheCount += langObj.fiche;
        }
    }
    return ficheCount;
};
Scrutari.Meta.prototype.getCorpusFicheCount = function (code) {
    var corpus = this.getCorpus(code);
    if (!corpus) {
        return 0;
    }
    return corpus.stats.fiche;
};
Scrutari.Meta.prototype.getCorpusLangFicheCount = function (code, langArray) {
    var corpus = this.getCorpus(code);
    if (!corpus) {
        return 0;
    }
    var ficheCount = 0;
    var length = corpus.stats.langArray.length;
    for(var i = 0; i < length; i++) {
        var langObj = corpus.stats.langArray[i];
        if ($.inArray(langObj.lang, langArray) !== -1) {
            ficheCount += langObj.fiche;
        }
    }
    return ficheCount;
};
Scrutari.Meta.prototype.getBaseArray = function (sortFunction) {
    var array = new Array();
    var baseMap = this.engineInfo.baseMap;
    var p=0;
    for(var prop in baseMap) {
        array[p] = baseMap[prop];
        p++;
    }
    if (sortFunction) {
        array = array.sort(sortFunction);
    }
    return array;
};
Scrutari.Meta.prototype.getLangArray = function (sortFunction) {
    var array = new Array();
    var length = this.engineInfo.stats.langArray.length;
    for(var i = 0; i < length; i++) {
        array[i] = this.engineInfo.stats.langArray[i];
    }
    if (sortFunction) {
        array = array.sort(sortFunction);
    }
    return array;
};
Scrutari.Meta.prototype.getCategoryArray = function (sortFunction) {
    var array = new Array();
    if (!this.engineInfo.hasOwnProperty("categoryMap")) {
        return array;
    }
    var categoryMap = this.engineInfo.categoryMap;
    var p=0;
    for(var prop in categoryMap) {
        array[p] = categoryMap[prop];
        p++;
    }
    if (sortFunction) {
        array = array.sort(sortFunction);
    }
    return array;
};
Scrutari.Meta.prototype.getCorpusArray = function (sortFunction) {
    var array = new Array();
    var corpusMap = this.engineInfo.corpusMap;
    var p=0;
    for(var prop in corpusMap) {
        array[p] = corpusMap[prop];
        p++;
    }
    if (sortFunction) {
        array = array.sort(sortFunction);
    }
    return array;
};
Scrutari.Meta.prototype.getAttributeArray = function (type) {
    if (!this.engineInfo.hasOwnProperty("attributes")) {
        return new Array();
    }
    if (!this.engineInfo.attributes.hasOwnProperty(type)) {
        return new Array();
    }
    return this.engineInfo.attributes[type];
};
Scrutari.Meta.prototype.getBase = function (code) {
    var key = "code_" + code;
    if (this.engineInfo.baseMap.hasOwnProperty(key)) {
        return this.engineInfo.baseMap[key];
    } else {
        return null;
    }
};
Scrutari.Meta.prototype.getCorpus = function (code) {
    var key = "code_" + code;
    if (this.engineInfo.corpusMap.hasOwnProperty(key)) {
        return this.engineInfo.corpusMap[key];
    } else {
        return null;
    }
};
Scrutari.Meta.prototype.getThesaurus = function (code) {
    var key = "code_" + code;
    if (this.engineInfo.thesaurusMap.hasOwnProperty(key)) {
        return this.engineInfo.thesaurusMap[key];
    } else {
        return null;
    }
};
Scrutari.Meta.prototype.getCategory = function (categoryName) {
    if (this.engineInfo.hasOwnProperty("categoryMap")) {
        if (this.engineInfo.categoryMap.hasOwnProperty(categoryName)) {
            return this.engineInfo.categoryMap[categoryName];
        } else {
            return null;
        }
    } else {
        return null;
    }
 };
 Scrutari.Meta.prototype.getCategoryForCorpus = function (code) {
     if (!this.engineInfo.hasOwnProperty("categoryMap")) {
        return null;
    }
    var categoryMap = this.engineInfo.categoryMap;
    for(var prop in categoryMap) {
        var category = categoryMap[prop];
        for(var i = 0, len = category.codecorpusArray.length; i < len; i++) {
            if (category.codecorpusArray[i] === code) {
                return category;
            }
        }
    }
    return null;
 };
Scrutari.Meta.prototype.getLangLabel = function (iso) {
    if (this.engineInfo.langMap.hasOwnProperty(iso)) {
        return this.engineInfo.langMap[iso];
    } else {
        return iso;
    }
};
Scrutari.Meta.prototype.withCategory = function () {
    return this.engineInfo.hasOwnProperty("categoryMap");
};
Scrutari.Meta.prototype.getCorpusArrayForCategories = function (categoryArray) {
    var result = new Array();
    if (!this.engineInfo.hasOwnProperty("categoryMap")) {
        return result;
    }
    for(var i = 0; i < categoryArray.length; i++) {
        var categoryName = categoryArray[i];
        if (this.engineInfo.categoryMap.hasOwnProperty(categoryName)) {
            result = result.concat(this.engineInfo.categoryMap[categoryName].codecorpusArray);
        }
    }
    return result;
};
Scrutari.Meta.prototype.getCorpusArrayForBases = function (baseArray) {
    var result = new Array();
    for(var i = 0; i < baseArray.length; i++) {
        var key = "code_" + baseArray[i];
        if (this.engineInfo.baseMap.hasOwnProperty(key)) {
            result = result.concat(this.engineInfo.baseMap[key].codecorpusArray);
        }
    }
    return result;
};
Scrutari.Meta.prototype.getComplementTitle = function(code, complementNumber) {
    var corpus = this.getCorpus(code);
    if (!corpus) {
        return "";
    }
    var key = "complement_" + complementNumber;
    if (corpus.phraseMap.hasOwnProperty(key)) {
        return corpus.phraseMap[key];
    } else {
        return key;
    }
};
Scrutari.Result = function (ficheSearchResult, requestParameters, groupSortFunction) {
    this.ficheSearchResult = ficheSearchResult;
    this.requestParameters = requestParameters;
    this.searchMeta = ficheSearchResult.searchMeta;
    this.ficheGroupArray = ficheSearchResult.ficheGroupArray;
    if ((groupSortFunction) && (this.ficheGroupArray.length > 1)) {
        this.ficheGroupArray = this.ficheGroupArray.sort(groupSortFunction);
    }
    this.motcleMap = new Object();
    if (ficheSearchResult.hasOwnProperty("motcleArray")) {
        var length = ficheSearchResult.motcleArray.length;
        for(var i = 0; i < length; i++) {
            var motcle = ficheSearchResult.motcleArray[i];
            this.motcleMap["code_" + motcle.codemotcle] = motcle;
        }
    }
};
Scrutari.Result.newSearch = function (scrutariConfig, requestParameters, callback, apiErrorCallback) {
    var _ficheSearchResultCallback = function (ficheSearchResult) {
        callback(new Scrutari.Result(ficheSearchResult, requestParameters, scrutariConfig.options.groupSortFunction));
    };
    Scrutari.Ajax.loadFicheSearchResult(scrutariConfig, requestParameters, _ficheSearchResultCallback, apiErrorCallback);
};
Scrutari.Result.prototype.getQId = function () {
    if (this.searchMeta) {
        return this.searchMeta.qId;
    } else {
        return "";
    }
};
Scrutari.Result.prototype.getQ = function () {
    if (this.searchMeta) {
        return this.searchMeta.q;
    } else {
        return "";
    }
};
Scrutari.Result.prototype.getFicheCount = function () {
    if (this.searchMeta) {
        return this.searchMeta.ficheCount;
    } else {
        return -1;
    }
};
Scrutari.Result.prototype.getFicheGroupType = function () {
    var type = this.ficheSearchResult.ficheGroupType;
    if (type === "none") {
        type = "unique";
    }
    return type;
};
Scrutari.Result.prototype.getUniqueFicheArray = function () {
    if (this.ficheGroupArray.length === 0) {
        return new Array();
    }
    return this.ficheGroupArray[0].ficheArray;
};
Scrutari.Result.prototype.selectUniqueFicheArray = function (paginationLength, paginationNumber) {
    var selectionArray = new Array();
    if (this.ficheGroupArray.length === 0) {
        return selectionArray;
    }
    var ficheArray = this.ficheGroupArray[0].ficheArray;
    var startIndex = paginationLength * (paginationNumber - 1);
    var length = ficheArray.length;
    if (startIndex >= length) {
        return selectionArray;
    }
    var min = Math.min(ficheArray.length, startIndex + paginationLength);
    for(var i = startIndex; i < min; i++) {
        selectionArray.push(ficheArray[i]);
    }
    return selectionArray;
};
Scrutari.Result.prototype.isUniquePaginationLoaded = function (paginationLength, paginationNumber) {
    if (this.ficheGroupArray.length === 0) {
        return true;
    }
    var ficheCount = this.getFicheCount();
    var ficheArray = this.ficheGroupArray[0].ficheArray;
    var length = ficheArray.length;
    if (length === ficheCount) {
        return true;
    }
    var endIndex = (paginationLength * paginationNumber) - 1;
    if (endIndex < length) {
        return true;
    }
    return false;
};
Scrutari.Result.prototype.loadUniquePagination = function (scrutariConfig, paginationLength, paginationNumber, callback) {
    if (this.ficheGroupArray.length === 0) {
        return true;
    }
    var group = this.ficheGroupArray[0];
    if (!group) {
        return;
    }
    var ficheCount = this.getFicheCount();
    var ficheArray = group.ficheArray;
    var length = ficheArray.length;
    if (length === ficheCount) {
        return;
    }
    var _existingFicheSearchResultCallback = function (ficheSearchResult) {
        var newCount = ficheSearchResult.ficheGroupArray.length;
        if (newCount > 0) {
            group.ficheArray = group.ficheArray.concat(ficheSearchResult.ficheGroupArray[0].ficheArray);
        }
        if (callback) {
            callback();
        }
    };
    var requestParameters = {
        qid: this.getQId(),
        start: length +1,
        limit: (paginationLength * (paginationNumber + 2)) - length
    };
    Scrutari.Ajax.loadExistingFicheSearchResult(scrutariConfig, requestParameters, _existingFicheSearchResultCallback); 
};
Scrutari.Result.prototype.isCategoryPaginationLoaded = function (categoryName, paginationLength, paginationNumber) {
    var group = this.getFicheGroupByCategoryName(categoryName);
    if (!group) {
        return true;
    }
    var categoryFicheCount = group.ficheCount;
    var ficheArray = group.ficheArray;
    var length = ficheArray.length;
    if (length === categoryFicheCount) {
        return true;
    }
    var endIndex = (paginationLength * paginationNumber) - 1;
    if (endIndex < length) {
        return true;
    }
    return false;
};
Scrutari.Result.prototype.loadCategoryPagination = function (scrutariConfig, categoryName, paginationLength, paginationNumber, callback) {
    var group = this.getFicheGroupByCategoryName(categoryName);
    if (!group) {
        return;
    }
    var categoryFicheCount = group.ficheCount;
    var ficheArray = group.ficheArray;
    var length = ficheArray.length;
    if (length === categoryFicheCount) {
        return;
    }
    var _existingFicheSearchResultCallback = function (ficheSearchResult) {
        var newCount = ficheSearchResult.ficheGroupArray.length;
        for(var i = 0; i < newCount; i++) {
            var newGroup = ficheSearchResult.ficheGroupArray[i];
            if (newGroup.category.name === group.category.name) {
                group.ficheArray = group.ficheArray.concat(newGroup.ficheArray);
            }
        }
        callback();
    };
    var requestParameters = {
        qid: this.getQId(),
        start: length +1,
        limit: (paginationLength * (paginationNumber + 2)) - length,
        starttype: "in:" + categoryName
    };
    Scrutari.Ajax.loadExistingFicheSearchResult(scrutariConfig, requestParameters, _existingFicheSearchResultCallback); 
};
Scrutari.Result.prototype.selectCategoryFicheArray = function (categoryName, paginationLength, paginationNumber) {
    var selectionArray = new Array();
    var ficheArray = this.getCategoryFicheArrayByName(categoryName);
    var startIndex = paginationLength * (paginationNumber - 1);
    var length = ficheArray.length;
    if (startIndex >= length) {
        return selectionArray;
    }
    var min = Math.min(ficheArray.length, startIndex + paginationLength);
    for(var i = startIndex; i < min; i++) {
        selectionArray.push(ficheArray[i]);
    }
    return selectionArray;
};
Scrutari.Result.prototype.getCategoryCount = function () {
    return this.ficheGroupArray.length;
};
Scrutari.Result.prototype.getCategory = function (index) {
    return this.ficheGroupArray[index].category;
};
Scrutari.Result.prototype.getFicheGroupByCategoryName = function (categoryName) {
    var groupCount = this.ficheGroupArray.length;
    for(var i = 0; i < groupCount; i++) {
        var group = this.ficheGroupArray[i];
        if ((group.category) && (group.category.name === categoryName)) {
            return group;
        }
    }
    return null;
};
Scrutari.Result.prototype.getCategoryFicheCount = function (index) {
    return this.ficheGroupArray[index].ficheCount;
};
Scrutari.Result.prototype.getCategoryFicheCountbyName = function (categoryName) {
    var groupCount = this.ficheGroupArray.length;
    for(var i = 0; i < groupCount; i++) {
        var group = this.ficheGroupArray[i];
        if ((group.category) && (group.category.name === categoryName)) {
            return group.ficheCount;
        }
    }
    return 0;
};
Scrutari.Result.prototype.getCategoryFicheArray = function (index) {
    return this.ficheGroupArray[index].ficheArray;
};
Scrutari.Result.prototype.getCategoryFicheArrayByName = function (categoryName) {
    var categoryCount = this.getCategoryCount();
    for(var i = 0; i < categoryCount; i++) {
        var category = this.getCategory(i);
        if (category.name === categoryName) {
            return this.getCategoryFicheArray(i);
        }
    }
    return new Array();
};
Scrutari.Result.prototype.getMotcle = function (code) {
    var key = "code_" + code;
    if (this.motcleMap.hasOwnProperty(key)) {
        return this.motcleMap[key];
    } else {
        return null;
    }
};
Scrutari.Result.prototype.completeFiche = function (fiche, scrutariMeta, options) {
    var scrutariResult = this;
    var _addAttributes = function (type) {
        var attributeArray = scrutariMeta.getAttributeArray(type);
        if (attributeArray.length === 0) {
            return;
        }
        var objArray = new Array();
        for(var i = 0, len = attributeArray.length; i < len; i++) {
            var attribute = attributeArray[i];
            if (fiche.mattrMap.hasOwnProperty(attribute.name)) {
                objArray.push({
                    name: attribute.name,
                    title: attribute.title,
                    type: attribute.type,
                    valueArray: fiche.mattrMap[attribute.name]
                });
            }
        }
        fiche["_" + type + "AttributeArray"] = objArray;
    };
    fiche._hasAttribute = function (key) {
        return (this.attrMap) && (this.attrMap.hasOwnProperty(key));
    };
    fiche._hasMAttribute = function (key) {
        return (this.mattrMap) && (this.mattrMap.hasOwnProperty(key));
    };
    if (fiche.hasOwnProperty("mcomplementArray")) {
        for(var i = 0, len = fiche.mcomplementArray.length; i < len; i++) {
            fiche.mcomplementArray[i].title = scrutariMeta.getComplementTitle(fiche.codecorpus, fiche.mcomplementArray[i].number);
        }
    }
    if (fiche.hasOwnProperty("codemotcleArray")) {
        var motcleArray = new Array();
        for(var i = 0, len = fiche.codemotcleArray.length; i < len; i ++) {
            var motcle = scrutariResult.getMotcle(fiche.codemotcleArray[i]);
            if (motcle) {
                motcleArray.push(motcle);
            }
        }
        if (motcleArray.length > 0) {
            fiche._motcleArray = motcleArray;
        }
    }
    if (fiche.hasOwnProperty("mattrMap")) {
        _addAttributes("primary");
        _addAttributes("secondary");
    }
    var withThumbnail = true;
    if (options.ignoreThumbnail) {
        withThumbnail = false;
    }
    if (withThumbnail) {
        if (fiche.hasOwnProperty("thumbnail")) {
            fiche._thumbnail = fiche.thumbnail;
        } else if (fiche._hasAttribute("sct:thumbnail")) {
            fiche._thumbnail = fiche.attrMap["sct:thumbnail"][0];
        }
    }
    var withIcon = true;
    if (options.ignoreIcon) {
        withIcon = false;
    }
    if (withIcon) {
        if (fiche.hasOwnProperty("icon")) {
            fiche._icon = fiche.icon;
        } else if (fiche.hasOwnProperty("ficheicon")) {
            fiche._icon = fiche.ficheicon;
        }
    }
    if (options.ficheTarget) {
        fiche._target = options.ficheTarget;
    }
    return fiche;
};
Scrutari.Utils = {};
Scrutari.Utils.divideIntoColumns = function (objectArray, jqArgument, objectTemplate) {
    var objectCount = objectArray.length;
    if (objectCount === 0) {
        return;
    }
    var $elements = Scrutari.convert(jqArgument);
    var elementCount = $elements.length;
    if (elementCount === 0) {
        Scrutari.log("HtmlElement selection with jqArgument is empty ");
        return;
    }
    var objectCount = objectArray.length;
    if (objectCount <= elementCount) {
        for(var i = 0; i < objectCount; i++) {
            $($elements[i]).append(objectTemplate(objectArray[i]));
        }
        return;
    }
    var modulo = objectCount % elementCount;
    var columnLength = (objectCount - modulo) / elementCount;
    var start = 0;
    var stop = 0;
    for(var i = 0; i< elementCount; i++) {
        var $element = $($elements[i]);
        stop += columnLength;
        if (i < modulo) {
            stop++;
        }
        for(var j = start; j < stop; j++) {
            $element.append(objectTemplate(objectArray[j]));
        }
        start = stop;
    }
};
Scrutari.Utils.getTabArray = function (ficheCount, paginationLength, currentPaginationNumber) {
    var result = new Array();
    var paginationCount;
    if (ficheCount <= paginationLength) {
        paginationCount = 1;
        return result;
    } else {
        var modulo = ficheCount % paginationLength;
        paginationCount = (ficheCount - modulo) / paginationLength;
        if (modulo > 0) {
            paginationCount ++;
        }
    }
    if (currentPaginationNumber > paginationCount) {
        currentPaginationNumber = paginationCount;
    }
    var paginationNumberStart = 1;
    var paginationNumberEnd = 9;
    if (currentPaginationNumber > 6) {
        paginationNumberStart = currentPaginationNumber - 3;
        paginationNumberEnd = currentPaginationNumber + 3;
    }
    if (paginationNumberEnd > paginationCount) {
        paginationNumberEnd = paginationCount;
    }
    if (paginationNumberStart > 1) {
        result.push({
                number: 1,
                title: "1",
                state: 'enabled'
        });
        result.push({
                number: 0,
                title: "…",
                state: 'disabled'
        });
    }
    for(var i = paginationNumberStart; i <= paginationNumberEnd; i++) {
        var state = 'enabled';
        if (i === currentPaginationNumber) {
            state = 'active';
        }
        result.push({
                number: i,
                title: i.toString(),
                state: state
        });
    }
    if (paginationNumberEnd < paginationCount) {
        result.push({
                number: 0,
                title: "…",
                state: 'disabled'
        });
    }
    return result;
};
Scrutari.Utils.disable = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('disabled', true);
    return $elements;
};
Scrutari.Utils.enable = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('disabled', false);
    return $elements;
};
Scrutari.Utils.uncheck = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('checked', false);
    return $elements;
};
Scrutari.Utils.check = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('checked', true);
    return $elements;
};
Scrutari.Utils.toggle = function (jqElement, stateDataKey) {
    var state = jqElement.data(stateDataKey);
    if (state === 'off') {
        state = 'on';
    } else {
        state = 'off';
    }
    jqElement.data(stateDataKey, state);
    return state;
};
Scrutari.Utils.toggle.disabled = function (jqArgument, state) {
    var $elements = Scrutari.convert(jqArgument);
    if (state === 'off') {
        $elements.prop('disabled', true);
    } else {
        $elements.prop('disabled', false);
    }
    return $elements;
};
Scrutari.Utils.toggle.text = function (jqArgument, alterDataKey) {
    var $elements = Scrutari.convert(jqArgument);
    var length = $elements.length;
    for(var i = 0; i < length; i++) {
        var jqEl = $($elements[i]);
        var currentText =jqEl.text();
        var alterText = jqEl.data(alterDataKey);
        jqEl.text(alterText);
        jqEl.data(alterDataKey, currentText);
    }
    return $elements;
};
Scrutari.Utils.toggle.classes = function (jqArgument, state, onClass, offClass) {
    var $elements = Scrutari.convert(jqArgument);
    if (state === 'off') {
        $elements.addClass(offClass).removeClass(onClass);
    } else {
        $elements.removeClass(offClass).addClass(onClass);
    }
    return $elements;
};
Scrutari.Utils.getBaseSortFunction = function (baseSortType, locales) {
    var _ficheCountSort = function (base1, base2) {
        var count1 = base1.stats.fiche;
        var count2 = base2.stats.fiche;
        if (count1 > count2) {
            return -1;
        } else if (count1 < count2) {
            return 1;
        } else {
            return Scrutari.Utils.compareCodebase(base1, base2);
        }
    };
    var compareFunction = Scrutari.Utils.getCompareLocaleFunction(locales);
    var _titleSort = function (base1, base2) {
        var title1 = base1.title;
        var title2 = base2.title;
        if (!title1) {
            title1 = "";
        }
        if (!title2) {
            title2 = "";
        }
        var comp = compareFunction(title1, title2);
        if (comp !== 0) {
            return comp;
        } else {
            return Scrutari.Utils.compareCodebase(base1, base2);
        }
    };
    switch(baseSortType) {
        case "fiche-count":
            return _ficheCountSort;
        case "title":
            return _titleSort;
        default:
            return null;
    }
};
Scrutari.Utils.getCorpusSortFunction = function (corpusSortType, locales) {
    var _ficheCountSort = function (corpus1, corpus2) {
        var count1 = corpus1.stats.fiche;
        var count2 = corpus2.stats.fiche;
        if (count1 > count2) {
            return -1;
        } else if (count1 < count2) {
            return 1;
        } else {
            return Scrutari.Utils.compareCodecorpus(corpus1, corpus2);
        }
    };
    var compareFunction = Scrutari.Utils.getCompareLocaleFunction(locales);
    var _titleSort = function (corpus1, corpus2) {
        var title1 = corpus1.title;
        var title2 = corpus2.title;
        if (!title1) {
            title1 = "";
        }
        if (!title2) {
            title2 = "";
        }
        var comp = compareFunction(title1, title2);
        if (comp !== 0) {
            return comp;
        } else {
            return Scrutari.Utils.compareCodecorpus(corpus1, corpus2);
        }
    };
    switch(corpusSortType) {
        case "fiche-count":
            return _ficheCountSort;
        case "title":
            return _titleSort;
        default:
            return null;
    }
};
Scrutari.Utils.getCategorySortFunction = function (categorySortType, locales) {
    var _rankSort = function (category1, category2) {
        var count1 = category1.rank;
        var count2 = category2.rank;
        if (count1 > count2) {
            return -1;
        } else if (count1 < count2) {
            return 1;
        } else {
            var code1 = category1.name;
            var code2 = category2.name;
            if (code1 < code2) {
                return -1;
            } else if (code1 > code2) {
                return 1;
            } else {
                return 0;
            }
        }
    };
     var _ficheCountSort = function (category1, category2) {
        var count1 = category1.stats.fiche;
        var count2 = category2.stats.fiche;
        if (count1 > count2) {
            return -1;
        } else if (count1 < count2) {
            return 1;
        } else {
            return _rankSort(category1, category2);
        }
    };
    var compareFunction = Scrutari.Utils.getCompareLocaleFunction(locales);
    var _titleSort = function (category1, category2) {
        var title1 = category1.title;
        var title2 = category2.title;
        if (!title1) {
            title1 = "";
        }
        if (!title2) {
            title2 = "";
        }
        var comp = compareFunction(title1, title2);
        if (comp !== 0) {
            return comp;
        } else {
            return _rankSort(category1, category2);
        }
    };
    switch(categorySortType) {
        case "rank":
            return _rankSort;
        case "fiche-count":
            return _ficheCountSort;
        case "title":
            return _titleSort;
        default:
            return null;
    }
};
Scrutari.Utils.getLangSortFunction = function (langSortType, locales) {
    var _codeSort = function (lang1, lang2) {
        var code1 = lang1.lang;
        var code2 = lang2.lang;
        if (code1 < code2) {
            return -1;
        } else if (code1 > code2) {
            return 1;
        } else {
            return 0;
        }
    };
    var _ficheCountSort = function (lang1, lang2) {
        var count1 = lang1.fiche;
        var count2 = lang2.fiche;
        if (count1 > count2) {
            return -1;
        } else if (count1 < count2) {
            return 1;
        } else {
            return _codeSort(lang1, lang2);
        }
    };
    var compareFunction = Scrutari.Utils.getCompareLocaleFunction(locales);
    var _titleSort = function (lang1, lang2) {
        var title1 = lang1.title;
        var title2 = lang2.title;
        if (!title1) {
            title1 = lang1.lang;
        }
        if (!title2) {
            title2 = lang2.lang;
        }
        var comp = compareFunction(title1, title2);
        if (comp !== 0) {
            return comp;
        } else {
            return _codeSort(lang1, lang2);
        }
    };
    switch(langSortType) {
        case "code":
            return _codeSort;
        case "fiche-count":
            return _ficheCountSort;
        case "title":
            return _titleSort;
        default:
            return null;
    }
};
Scrutari.Utils.mark = function (markArray, classAttribute) {
    if (!classAttribute) {
        classAttribute = "scrutari-Mark";
    }
    var html = "";
    var length = markArray.length;
    for (var i = 0; i < length; i++) {
        var obj = markArray[i];
        if (typeof obj === 'string') {
            html += obj;
        } else if (obj.s) {
            html += "<span class='" + classAttribute + "'>";
            html += Scrutari.escape(obj.s);
            html += "</span>";
        }
    }
    return html;
};
Scrutari.Utils.formatSearchSequence = function (client, scrutariResult) {
    var q = scrutariResult.getQ();
    q = q.replace(/\&\&/g, client.loc('_ and'));
    q = q.replace(/\|\|/g, client.loc('_ or'));
    return q;
};
Scrutari.Utils.render = function (templateString, object) {
    var result = templateString;
    for(var key in object) {
        var normalReplace = new RegExp("{{:" + key + "}}", 'g');
        var escapeReplace = new RegExp("{{>" + key + "}}", 'g');
        var value = object[key];
        result = result.replace(normalReplace, value);
        result = result.replace(escapeReplace, Scrutari.escape(value));
    }
    return result;
};
Scrutari.Utils.compareCodebase = function (obj1, obj2) {
    var code1 = obj1.codebase;
    var code2 = obj2.codebase;
    if (code1 < code2) {
        return -1;
    } else if (code1 > code2) {
        return 1;
    } else {
        return 0;
    }
};
Scrutari.Utils.compareCodecorpus = function (obj1, obj2) {
    var code1 = obj1.codecorpus;
    var code2 = obj2.codecorpus;
    if (code1 < code2) {
        return -1;
    } else if (code1 > code2) {
        return 1;
    } else {
        return 0;
    }
};
Scrutari.Utils.getCompareLocaleFunction = function (locales) {
    var _localeCompareSupportsLocales = function () {
        try {
            "a".localeCompare("b", "i");
        } catch (exception) {
            return exception.name === "RangeError";
        }
        return false;
    };
    var _localesCompare = function (string1, string2) {
        return string1.localeCompare(string2, locales, {
            usage: "sort",
            sensitivity: "base",
            ignorePunctuation: true});
    };
    var _oldCompare = function (string1, string2) {
        string1 = string1.toLowerCase();
        string2 = string2.toLowerCase();
        return string1.localeCompare(string2);
    };
    if (_localeCompareSupportsLocales()) {
        return _localesCompare;
    } else {
        return _oldCompare;
    }
};
Scrutari.Utils.buildCorpusMap = function (scrutariMeta, arrays) {
    var corpusMap = new Object();
    var finalCount = 0;
    if (arrays.categoryArray)  {
        finalCount++;
        var arrayForCategories = scrutariMeta.getCorpusArrayForCategories(arrays.categoryArray);
        for(var i = 0; i < arrayForCategories.length; i++) {
            var key = "code_" + arrayForCategories[i];
            if (corpusMap.hasOwnProperty(key)) {
                corpusMap[key] = corpusMap[key] + 1;
            } else {
                corpusMap[key] = 1;
            }
        }
    }
    if (arrays.baseArray)  {
        finalCount++;
        var arrayForBases = scrutariMeta.getCorpusArrayForBases(arrays.baseArray);
        for(var i = 0; i < arrayForBases.length; i++) {
            var key = "code_" + arrayForBases[i];
            if (corpusMap.hasOwnProperty(key)) {
                corpusMap[key] = corpusMap[key] + 1;
            } else {
                corpusMap[key] = 1;
            }
        }
    }
    if (arrays.corpusArrays)  {
        finalCount++;
        for(var i = 0; i < arrays.corpusArrays.length; i++) {
            var key = "code_" + arrays.corpusArrays[i];
            if (corpusMap.hasOwnProperty(key)) {
                corpusMap[key] = corpusMap[key] + 1;
            } else {
                corpusMap[key] = 1;
            }
        }
    }
    corpusMap.completeValue = finalCount;
    return corpusMap;
};
Scrutari.Utils.checkKey = function (type, value) {
    switch(type) {
        case "base":
        case "corpus":
            return "code_" + value;
    }
    return value;
};
Scrutari.Loc = function (map) {
    if (map) {
        this.map = map;
    } else {
        this.map = new Object();
    }
};
Scrutari.Loc.prototype.putAll = function (map) {
    for(var key in map) {
        this.map[key] = map[key];
    }
};
Scrutari.Loc.prototype.putLoc = function (locKey, locText) {
    this.map[locKey] = locText;
};
Scrutari.Loc.prototype.loc = function (locKey) {
    if (!this.map.hasOwnProperty(locKey)) {
        return locKey;
    }
    var text = this.map[locKey];
    var argLength = arguments.length;
    if (argLength > 1) {
        for(var i = 0; i < argLength; i++) {
            var p = i -1;
            var mark = "{" + p + "}";
            text = text.replace(mark, arguments[i]);
        }
    }
    return text;
};
Scrutari.Loc.prototype.escape = function (locKey) {
    return Scrutari.escape(this.loc.apply(this, arguments));
};
Scrutari.FilterState = function () {
    this.empty = true;
    this.langOnly = true;
    this.all = {
        category: true,
        base: true,
        corpus: true,
        lang: true
    };
    this.maps = {
        category: {},
        base: {},
        corpus: {},
        lang: {}
    };
    this.titles = {
        category: [],
        base: [],
        corpus: [],
        lang: []
    };
};
Scrutari.FilterState.prototype.contains = function (type, key) {
    if (this.all[type]) {
        return true;
    }
    key = Scrutari.Utils.checkKey(type, key);
    return this.maps[type].hasOwnProperty(key);
};
Scrutari.FilterState.prototype.add = function (type, key, title) {
    this.all[type] = false;
    this.empty = false;
    if (type !== "lang") {
        this.langOnly = false;
    }
    key = Scrutari.Utils.checkKey(type, key);
    if (!this.maps[type].hasOwnProperty(key)) {
        if (!title) {
            title = key;
        }
        this.maps[type][key] = title;
        this.titles[type].push(title);
    }
};
Scrutari.Stats = function (scrutariMeta) {
    this.unitArray = new Array();
    var maps = {
        category: {},
        base: {},
        corpus: {},
        lang: {}
    };
    this.maps = maps;
    this.filterState = null;
    var corpusArray = scrutariMeta.getCorpusArray();
    for(var i = 0, len = corpusArray.length; i < len; i++) {
        var corpus = corpusArray[i];
        var langArray = corpus.stats.langArray;
        var category = scrutariMeta.getCategoryForCorpus(corpus.codecorpus);
        var categoryName = "";
        if (category) {
            categoryName = category.name;
        }
        for(var j = 0, len2 = langArray.length; j < len2; j++) {
            var lang = langArray[j];
            var unit = new Scrutari.Stats.Unit(categoryName, corpus.codebase, corpus.codecorpus, lang.lang, lang.fiche);
            this.unitArray.push(unit);
            _addInMap("category", unit, categoryName);
            _addInMap("base", unit, "code_" + corpus.codebase);
            _addInMap("corpus", unit, "code_" + corpus.codecorpus);
            _addInMap("lang", unit, lang.lang);
        }
    }
    function _addInMap(type, unit, key) {
        var map = maps[type];
        if (!map.hasOwnProperty(key)) {
            map[key] = new Array();
        }
        map[key].push(unit);
    }
};
Scrutari.Stats.prototype.update = function (filterState) {
    this.filterState = filterState;
};
Scrutari.Stats.prototype.getFicheCount = function (type, key) {
    key = Scrutari.Utils.checkKey(type, key);
    var map = this.maps[type];
    if (!map.hasOwnProperty(key)) {
        Scrutari.log("Unknown key: " + key);
        return 0;
    }
    var array = map[key];
    var count = 0;
    for(var i = 0, len = array.length; i < len; i++) {
        var unit = array[i];
        count += unit.check(this.filterState);
    }
    return count;
};
Scrutari.Stats.Unit = function (category, base, corpus, lang, value) {
    this.category = category;
    this.base = base;
    this.corpus = corpus;
    this.lang = lang;
    this.value = value;
};
Scrutari.Stats.Unit.prototype.check = function (filterState) {
    if (!filterState) {
        return this.value;
    }
    if (!filterState.contains("category", this.category)) {
        return 0;
    }
    if (!filterState.contains("base", this.base)) {
        return 0;
    }
    if (!filterState.contains("corpus", this.corpus)) {
        return 0;
    }
    if (!filterState.contains("lang", this.lang)) {
        return 0;
    }
    return this.value;
};
Scrutari.Client = function (scrutariConfig, clientId) {
    this.scrutariConfig = scrutariConfig;
    this.clientId = clientId;
    this.scrutariMeta = null;
    this.stats = null;
    this.isWaiting = false;
    this.mainCurrentScrutariResult = null;
    this.currentScrutariResult = null;
    this.options = {
        withCorpus: false,
        baseSort: "fiche-count",
        corpusSort: "fiche-count",
        categorySort: "rank",
        langSort: "code",
        initialQuery: "",
        initialQId: "",
        initialFilters: null,
        permalinkPattern: null,
        ficheTarget: "_blank",
        ignoreIcon: false,
        ignoreThumbnail: false,
        mainTitle: null,
        paginationChangeCallback: null,
        templateFactory: null
    };
    this._locInstance = new Scrutari.Loc();
    this._ignoreArray = new Array();
    this._structureMap = {};
    this._templateMap = {};
    this._scrutariResultMap = {};
    this._historyNumber = 0;
    this._modalFunction = function ($modal, action) {
    };
    if (typeof SCRUTARI_L10N !== 'undefined') {
        this._locInstance.putAll(SCRUTARI_L10N);
    }
    if (typeof SCRUTARI_HTML !== 'undefined') {
        this._htmlObject = SCRUTARI_HTML;
    }
    if (typeof SCRUTARI_FRAMEWORKINIT === 'function') {
        SCRUTARI_FRAMEWORKINIT(this);
    }
};
Scrutari.Client.prototype.loc = function (locKey) {
    return this._locInstance.loc(locKey);
};
Scrutari.Client.prototype.toPermalink = function (qId) {
    if (this.options.permalinkPattern) {
        return this.scrutariConfig.getPermalinkUrl(qId, this.options.permalinkPattern);
    }
    return null;
};
Scrutari.Client.prototype.storeResult = function (historyName, scrutariResult) {
    this._scrutariResultMap[historyName] = scrutariResult;
};
Scrutari.Client.prototype.unstoreResult = function (historyName) {
    this._scrutariResultMap[historyName] = null;
};
Scrutari.Client.prototype.getResult = function (historyName) {
    if (this._scrutariResultMap.hasOwnProperty(historyName)) {
        return this._scrutariResultMap[historyName];
    } else {
        return null;
    }
};
Scrutari.Client.prototype.newHistoryNumber = function () {
    this._historyNumber++;
    return this._historyNumber;
};
Scrutari.Client.prototype.ignoreElement = function (elementName) {
    return $.inArray(elementName, this._ignoreArray) > -1;
};
Scrutari.Client.prototype.getTemplate = function (templateName) {
    if (this.options.templateFactory) {
        if ($.isFunction(this.options.templateFactory)) {
            var template = this.options.templateFactory(this, templateName);
            if (template) {
                return template;
            }
        } else if ($.isArray(this.options.templateFactory)) {
            var factoryLength = this.options.templateFactory.length;
            if (factoryLength > 0) {
                for(var i = (factoryLength -1); i >= 0; i--) {
                    var templateFactory = this.options.templateFactory[i];
                    var template = templateFactory(this, templateName);
                    if (template) {
                        return template;
                    }
                }
            }
        }
    }
    if (templateName.indexOf(":") === -1) {
        templateName = "scrutari:" + templateName;
    }
    var template = $.templates[templateName];
    if (!template) {
        return function () {
            return "Unknown template : " + templateName;
        };
    } else {
        return template;
    }
};
Scrutari.Client.prototype.render = function (templateName, context, helpers) {
    var templateFunction = this.getTemplate(templateName);
    return templateFunction(context, helpers);
};
Scrutari.Client.prototype.$area = function (name, action) {
    var $area = Scrutari.$({scrutariArea: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($area);
                break;
            case 'hide':
                this.hide($area);
                break;
        }
    }
    return $area;
};
Scrutari.Client.prototype.$block = function (name, action) {
    var $block = Scrutari.$({scrutariBlock: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($block);
                break;
            case 'hide':
                this.hide($block);
                break;
        }
    }
    return $block;
};
Scrutari.Client.prototype.$button = function (name, action, option) {
    var $button = Scrutari.$({scrutariButton: name});
    if (action) {
        switch(action) {
            case 'on':
                $button.prop('disabled', false);
                break;
            case 'off':
                $button.prop('disabled', true);
                break;
            case 'show':
                this.show ($button);
                break;
            case 'hide':
                this.hide($button);
                break;
            case 'onclick':
                $("#" + this.clientId).on("click", Scrutari.toCssQuery({scrutariButton: name}), option);
                break;
        }
    }
    return $button;
};
Scrutari.Client.prototype.$count = function (name, action, value) {
    var $count = Scrutari.$({scrutariCount: name});
    if (action) {
        switch(action) {
            case 'update':
                if (!value) {
                    value = 0;
                }
                Scrutari.$($count, {scrutariRole: "value"}).html(this.formatNumber(value));
                break;
        }
    }
    return $count;
};
Scrutari.Client.prototype.$form = function (name) {
    return Scrutari.$({scrutariForm: name});
};
Scrutari.Client.prototype.$group = function (name) {
    return Scrutari.$({scrutariGroup: name});
};
Scrutari.Client.prototype.$hidden = function (name, action) {
    var $hidden = Scrutari.$({scrutariHidden: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($hidden);
                break;
            case 'hide':
                this.hide($hidden);
                break;
        }
    }
    return $hidden;
};
Scrutari.Client.prototype.$input = function (name, value) {
    if (value) {
        return Scrutari.$({_element: "input", _name: name, _value: value});
    } else {
        return Scrutari.$({_element: "input", _name: name});
    }
};
Scrutari.Client.prototype.$input_checked = function (name, value) {
    if (value) {
        return Scrutari.$({_element: "input", _name: name, _value: value, _checked: true});
    } else {
        return Scrutari.$({_element: "input", _name: name, _checked: true});
    }
};
Scrutari.Client.prototype.$label = function (name) {
    return Scrutari.$({scrutariLabel: name});
};
Scrutari.Client.prototype.$link = function (name) {
    return Scrutari.$({scrutariLink: name});
};
Scrutari.Client.prototype.$modal = function (name, action) {
    var $modal = Scrutari.$({scrutariModal: name});
    if (action) {
        this._modalFunction($modal, action);
    }
    return $modal;
};
Scrutari.Client.prototype.$panel = function (name, action) {
    var $panel = Scrutari.$({scrutariPanel: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($panel);
                break;
            case 'hide':
                this.hide($panel);
                break;
        }
    }
    return $panel;
};
Scrutari.Client.prototype.$title = function (name, action) {
    var $title = Scrutari.$({scrutariTitle: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($title);
                break;
            case 'hide':
                this.hide($title);
                break;
        }
    }
    return $title;
};
Scrutari.Client.prototype.show  = function ($elements) {
    $elements.removeClass("scrutari-Hidden");
};
Scrutari.Client.prototype.hide = function ($elements) {
    $elements.addClass("scrutari-Hidden");
};
Scrutari.Client.prototype.scrollToResult = function () {
    $(window).scrollTop(this.$area('result').offset().top);
};
Scrutari.Client.prototype.getStructureHtml = function (name) {
    if (this._structureMap.hasOwnProperty(name)) {
        return this._structureMap[name];
    } else {
        Scrutari.log("Unknown structure: " + name);
        return "";
    }
};
Scrutari.Client.prototype.getTemplateHtml = function (name) {
    if (this._templateMap.hasOwnProperty(name)) {
        return this._templateMap[name];
    } else {
        Scrutari.log("Unknown template: " + name);
        return "";
    }
};
Scrutari.Client.prototype.formatNumber = function (number) {
    if (Number.prototype.toLocaleString) {
        return number.toLocaleString(this.scrutariConfig.lang);
    } else {
        return number;
    }
};
Scrutari.Client.init = function (scrutariConfig, clientId, options, callback) {
    if (!$.templates) {
        throw new Error("JsRender is not installed");
    }
    $.views.helpers("scrutari_mark", function(markArray) {
        return Scrutari.Utils.mark(markArray);
    });
    Scrutari.Meta.load(scrutariConfig, function (scrutariMeta) {
        var client = new Scrutari.Client(scrutariConfig, clientId);
        $.views.helpers({
            scrutari_client: client,
            scrutari_loc:  function(key) {
                return client.loc(key);
            },
            scrutari_format: function(number) {
                return client.formatNumber(number);
             }
        });
        client.scrutariMeta = scrutariMeta;
        client.stats = new Scrutari.Stats(scrutariMeta);
        _checkOptions(client, options, scrutariMeta);
        _initMaps(client);
        Scrutari.Client.Ui.init(client);
        if (callback) {
            callback(client);
        }
    });
    function _checkOptions (client, options, scrutariMeta) {
        var defaultOptions = scrutariMeta.getDefaultOptions();
        for(var key in defaultOptions) {
            client.options[key] = defaultOptions[key];
        }
        if (options) {
            for(var key in options) {
                client.options[key] = options[key];
            }
        }
        if (options.locMap) {
            client._locInstance.putAll(options.locMap);
        }
        if (options.ignoreList) {
            var ignoreList = options.ignoreList;
            var ignoreArray;
            if ($.type(ignoreList) === "string") {
                ignoreArray = ignoreList.split(",");
            } else if ($.isArray(ignoreList)) {
                ignoreArray = ignoreList;
            }
            if (ignoreArray) {
                for(var i = 0, len = ignoreArray.length; i < len; i++) {
                    client._ignoreArray.push($.trim(ignoreArray[i]));
                }
            }
        }
    }
    function _initHtmlObject (client, htmlObject) {
        if (htmlObject) {
            if (htmlObject.structure) {
                for(var key in htmlObject.structure) {
                    client._structureMap[key] = htmlObject.structure[key];
                }
            }
            if (htmlObject.templates) {
                for(var key in htmlObject.templates) {
                    client._templateMap[key] = htmlObject.templates[key];
                }
            }
        }
    }
    function _initMaps (client) {
        _initHtmlObject(client, client._htmlObject);
        _initHtmlObject(client, options.htmlObject);
        $("script[type='text/x-scrutari-structure']").each(function (index, element) {
            var $element = $(element);
            client._structureMap[$element.data("name")] = $element.html();
        });
        $("script[type='text/x-scrutari-template']").each(function (index, element) {
            var $element = $(element);
            client._templateMap[$element.data("name")] = $element.html();
        });
        for(var name in client._templateMap) {
            var templateText = client._templateMap[name];
            templateText = templateText.replace(/tmpl=\"([-_0-9a-z]+)\"/g, 'tmpl="scrutari:$1"');
            $.templates("scrutari:" + name, templateText);
        }
    }    
};
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
        var subsearchText =  " + " + Scrutari.Utils.formatSearchSequence(client, scrutariResult) + " = ";
        if (client.currentHistoryName) {
            Scrutari.$(client.$block(client.currentHistoryName), {scrutariRole: "subsearch"}).text(subsearchText);
            var initialRequestValue = [...client.$block("historyList")[0].getElementsByClassName('scrutari-history-Active')][0].getElementsByTagName('a')[0].innerHTML.split('*')[0];
            scrutariResult.searchMeta.q = initialRequestValue + subsearchText;
            Scrutari.Client.Result.addToHistory(client, scrutariResult);
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