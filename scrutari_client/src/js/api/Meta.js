/* global Scrutari */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2017 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Objet encapsulant un objet engineInfo obtenu via l'API Json (requête type=engine) et proposant
 * des accesseurs et des méthodes de traitement.
 * Voir http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_engine
 * 
 * @constructor
 * @param {Object} engineInfo Objet engineInfo de l'API Scrutari
 */
Scrutari.Meta = function (engineInfo) {
    this.engineInfo = engineInfo;
};

/**
 * Fonction de retour utilisée par Scrutari.Meta.load prenant comme argument
 * une instance de Scrutari.Meta
 * 
 * @callback Scrutari.Meta~loadCallback
 * @param {Scrutari.Meta} scrutariMeta
 */

/**
 * Charge un objet ScrutariMeta qui est ensuite transmit à la fonction callback
 * 
 *  @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Scrutari.Meta~loadCallback} callback Fonction de retour du chargement de Scrutari.Meta
 * @return {undefined}
 */
Scrutari.Meta.load = function(scrutariConfig, callback) {
    var buffer = new Object();
    /*
     * Chaine (en partant de la fin) des appels Ajax.
     */
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

/**
 * Retourne l'objet EngineInfo encapsulé. Cet objet est décrit à la page :
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_engine
 * 
 * @returns {Object} engineInfo Objet engineInfo de l'API Scrutari
 */
Scrutari.Meta.prototype.getEngineInfo = function () {
    return this.engineInfo;
};

/**
 * Retourne le titre du moteur
 * 
 * @returns {String} title Titre du moteur
 */
Scrutari.Meta.prototype.getTitle = function () {
    return this.engineInfo.metadata.title;
};

/**
 * Retourne les options définies par le moteur
 * 
 * @returns {Object} options Options définies dans le moteur
 */
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

/**
 * Retourne le nombre total (toutes bases confondues) de fiches
 * recensées par le moteur Scrutari
 * 
 * @returns {Number} Nombre total de fiches
 */
Scrutari.Meta.prototype.getGlobalFicheCount = function () {
    return this.engineInfo.stats.fiche;
};

/**
 * Retourne le nombre total (toutes bases confondues) de fiches
 * recensées par le moteur Scrutari pour les langues indiquées par le
 * tableau langArray
 * 
 * @returns {Number} Nombre total de fiches pour les langues données
 * @param {String[]} langArray tableau des langues
 */
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

/**
 * Retourne le nombre total de fiches pour le corpus dont le code est donné
 * en argument
 * 
 * @param {Number} code
 * @returns {Number} Nombre total de fiches du corpus
 */
Scrutari.Meta.prototype.getCorpusFicheCount = function (code) {
    var corpus = this.getCorpus(code);
    if (!corpus) {
        return 0;
    }
    return corpus.stats.fiche;
};

/**
 * Retourne le nombre total de fiches pour le corpus dont le code est donné
 * en argument pour les langues indiquées par le tableau langArray
 * 
 * @param {Number} code
 * @param {String[]} langArray tableau des langues
 * @returns {Number} Nombre total de fiches du corpus
 */
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

/**
 * Retourne le tableau des bases du moteur. Les bases sont des objets tels que
 * définis dans l'API Scrutari :
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_base
 * 
 * @param {Function} [sortFunction] fonction optionnelle de tri des bases
 * @returns {Array} Tableau des bases
 */
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

/**
 * Retourne le tableau de statistiques par langues, c'est la popriété stats.langArray
 * telle que définie dans 
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_engine
 * 
 * @param {Function} [sortFunction] fonction optionnelle de tri des langues
 * @returns {Array} Tableau des langues
 */
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

/**
 * sortFunction n'est pas obligatoire
 */
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

/**
 * sortFunction n'est pas obligatoire
 */
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

/**
 * Indique si le moteur Scrutari propose des catégories dans sa configuration.
 * 
 * @returns {Boolean} Présence de catégories
 */
Scrutari.Meta.prototype.withCategory = function () {
    return this.engineInfo.hasOwnProperty("categoryMap");
};

/**
 * Retourne un tableau avec le code des corpus correspondant aux catégories
 * categoryArray étant un tableau des noms de catégorie
 */
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

/**
 * Retourne un tableau avec le code des corpus correspondant aux bases
 * baseArray étant un tableau des codes de base
 */
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
