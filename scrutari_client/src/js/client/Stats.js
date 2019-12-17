/* global Scrutari */

/**
 * @constructor
 */
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
