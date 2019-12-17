/* global Scrutari */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2017 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Construction d'un objet Scrutari.Config.
 * Une objet Scrutari.Config conserve des informations de configuration,
 * en particulier l'URL d'accès au moteur Scrutari.
 * 
 * @constructor
 * @param {String} name Nom de la configuration
 * @param {String} engineUrl Adresse du moteur Scrutari
 * @param {String} lang Langue de l'interface
 * @param {String} origin Paramètre origin transmis au moteur Scrutari
 * @param {Object} options Options supplémentaires
 */
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

/**
 * Retourne l'URL d'appel Json du moteur Scrutari
 * 
 * @returns {String} URL d'appel du Json
 */
Scrutari.Config.prototype.getJsonUrl = function () {
    return this.engineUrl + "json";
};

/**
 * Retourne l'URL de récupération du fichier correspondant à la recherche
 * possédant l'identifiant qId. Cette URL est construite à partir de l'URL du moteur
 * 
 * @param {String} qId Idenfiant de la recherche
 * @param {String} extension Extension à utiliser    
 * @returns {String} URL des données de la recherche au format de l'extension
 */
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


/**
 * Construit un permalien de fonction de permalinkPattern
 * $QUI et $LANG sont remplacés par les bonnes valeurs
 * 
 * @param {String} qId Idenfiant de la recherche
 * @param {String} permalinkPattern Gabarit de l'URL       
 * @returns {String} URL du permalien
 */
Scrutari.Config.prototype.getPermalinkUrl = function (qId, permalinkPattern) {
    var permalink = permalinkPattern.replace("$LANG", this.lang);
    permalink = permalink.replace("$QID", qId);
    return permalink;
};

/**
 *
 *@returns {Number} -1,0 ou 1
 */
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

