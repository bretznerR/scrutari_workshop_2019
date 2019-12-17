/* global Scrutari */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2017 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Objet encapsulant un objet ficheSearchResult obtenu via l'API Json (requête type=q-fiche) et proposant
 * des accesseurs et des méthodes de traitement.
 * Voir http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_qfiche
 * 
 * @constructor
 * @param {Object} ficheSearchResult Objet ficheSearchResult de l'API SCrutari
 * @param {Object} requestParameters paramètres envoyés à la requête Ajax
 * @param {Function} [groupSortFunction] Fonction optionnelle de tri des groupes
 */
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

/**
 * Fonction de retour utilisée par Scrutari.Result.newSearch.load prenant comme argument
 * une instance de Scrutari.Result
 * 
 * @callback Scrutari.Result~newSearchCallback
 * @param {Scrutari.Result} scrutariResult
 */

/**
 * Fonction de retour utilisée après chargement d'une nouvelle plage de fiches (pagination), ne prend pas d'argument
 * 
 * @callback Scrutari.Result~loadPaginationCallback
  */

/**
 * Construit une instance de ScrutariResult en effectuant unee nouvelle recherche
 * définie par les paramètres en argument. Cette instance est transmise à la fonction callback
 * 

 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la recherche qui seront transmis au moteur Scrutari
 * @param {Scrutari.Result~newSearchCallback} callback Fonction de retour du nouveau resultat Scrutari.Result
 * @param {apiErrorCallback} [apiErrorCallback] fonction de traitement d'erreur envoyée par le moteur Scrutari
 * @returns {undefined}
 */
Scrutari.Result.newSearch = function (scrutariConfig, requestParameters, callback, apiErrorCallback) {
    var _ficheSearchResultCallback = function (ficheSearchResult) {
        callback(new Scrutari.Result(ficheSearchResult, requestParameters, scrutariConfig.options.groupSortFunction));
    };
    Scrutari.Ajax.loadFicheSearchResult(scrutariConfig, requestParameters, _ficheSearchResultCallback, apiErrorCallback);
};

/**
 * Retourne l'identifiant de la recherche au sein du moteur Scrutari.
 * 
 * @returns {String} Identifiant de la recherche
 */
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

/**
 * Retourne le nombre de fiches comprises dans le résultat de la recherche
 * 
 * @returns {Number} Nombre de fiches dans le résultat
 */
Scrutari.Result.prototype.getFicheCount = function () {
    if (this.searchMeta) {
        return this.searchMeta.ficheCount;
    } else {
        return -1;
    }
};

/**
 * Retourne « unique » ou « category »
 */
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

/**
 * Retourne la liste des fiches de la plage correspondante, à utiliser
 * 
 * @param {Number} paginationLength nombre de fiches par pagination
 * @param {Number} paginationNumber numéro de pagination demandé
 */
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

/**
 * Indique si la plage est déjà chargée
 * 
 * @param {Number} paginationLength nombre de fiches par pagination
 * @param {Number} paginationNumber numéro de pagination demandé
 * @returns {Boolean}
 */
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

/**
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Number} paginationLength Nombre de fiches par pagination
 * @param {Number} paginationNumber Numéro de pagination demandé
 * @param {Scrutari.Result~loadPaginationCallback} [callback] Fonction de retour
 */
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

/**
 * @param {String} categoryName nom de la catégorie
 * @param {Number} paginationLength nombre de fiches par pagination
 * @param {Number} paginationNumber numéro de pagination demandé
 */
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

/**
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {String} categoryName Nom de la catégorie
 * @param {Number} paginationLength Nombre de fiches par pagination
 * @param {Number} paginationNumber Numéro de pagination demandé
 * @param {Scrutari.Result~loadPaginationCallback} [callback] Fonction de retour
 */
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

/**
 * @param {String} categoryName Nom de la catégorie
 * @param {Number} paginationLength Nombre de fiches par pagination
 * @param {Number} paginationNumber Numéro de pagination demandé
 */
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

/**
 * 
 * @param {String} categoryName Nom de la catégorie
 */
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

/**
 * 
 * @param {String} categoryName Nom de la catégorie
 */
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

/**
 * 
 * @param {String} categoryName Nom de la catégorie
 */
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
