/* global Scrutari */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2017 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Fonctions statiques d'appel Ajax
 */
Scrutari.Ajax = {};

/**
 * Requête Json type=base
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_base
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadBaseArrayCallback} baseArrayCallback
 * @returns {undefined}
 */
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

/**
 * Requête Json type=corpus
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_corpus
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadCorpusArrayCallback} corpusArrayCallback
 * @returns {undefined}
 */
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

/**
 * Requête Json type=thesaurus
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_thesaurus
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadThesaurusArrayCallback} thesaurusArrayCallback
 * @returns {undefined}
 */
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

/**
 * Requête Json type=motcle
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_motcle
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadMotcleArrayCallback} motcleArrayCallback
 * @returns {undefined}
 */
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

/**
 * Requête Json type=fiche
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_fiche
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadFicheArrayCallback} ficheArrayCallback
 * @returns {undefined}
 */
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

/**
 * Requête Json type=category
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_category
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadCategoryArrayCallback} categoryArrayCallback
 * @returns {undefined}
 */
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

/*
 * Requête Json type=engine
 * engineInfoCallback doit accepter comme argument un objet engineInfo tel que définit dans
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_engine
 * requestParameters est facultatif
 */
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

/*
 * requestParameters est obligatoire et doit posséder une propriété q ou des propriétés q_*
 * tel que défini dans http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_qfiche
 * apiErrorCallback est facultatif
 */
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

/*
 * requestParameters est obligatoire et doit contenir une propriété qid
 */
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

/**
 * Charge des données au format GeoJson tel que défini dans http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_geojson
 * 
 * @param {Scrutari.Config} scrutariConfig Configuration du moteur Scrutari
 * @param {Object} [requestParameters] Paramètres de la requête
 * @param {Scrutari.Ajax~loadGeoJsonCallback} geojsonCallback
 * @param {apiErrorCallback} [apiErrorCallback]
 * @returns {undefined}
 */
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

/**
 * Fonction invoquée lors du succès d'une requête Ajax, traite les messages d'erreur
 * (si apiErrorCallback n'est pas défini, envoie dans la console))
 * et les messages d'avertissement avant de faire appel à la fonction objectCallback en envoyant
 * le bon objet.
 * 
 * @param {Object} ajaxResult objet retourné par la requête Ajax
 * @param {String} objectName nom de la propriété désignant l'objet à traiter
 * @param {Function} objectCallback fonction de retour à appliquer à l'objet désigné par objectName
 * @param {apiErrorCallback} [apiErrorCallback]
 * @returns {undefined}
 */
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

/**
 * Test la présence d'avertissements et les écrit dans le journal
 * 
 * @param {Object} ajaxResult objet retourné par la requête Ajax
 * @returns {undefined}
 */
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

/*
 * Test la présence de name et définit sa valeur à defaultValue s'il n'est pas présent.
 */
Scrutari.Ajax.check = function (obj, name, defaultValue) {
    if (!obj.hasOwnProperty(name)) {
        if (defaultValue) {
            obj[name] = defaultValue;
        } else {
            obj[name] = "";
        }
    }
};

/**
 * Fonction de retour après chargement d'une requête type=base. Le paramètre
 * de la fonction est le tableau des bases tel que définit
 * par http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_base
 * 
 * @callback Scrutari.Ajax~loadBaseArrayCallback
 * @param {Array} baseArray
 */

/**
 * Fonction de retour après chargement d'une requête type=corpus. Le paramètre
 * de la fonction est le tableau des corpus tel que définit
 * par http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_corpus
 * 
 * @callback Scrutari.Ajax~loadCorpusArrayCallback
 * @param {Array} corpusArray
 */

/**
 * Fonction de retour après chargement d'une requête type=thesaurus. Le paramètre
 * de la fonction est le tableau des thésaurus tel que définit
 * par http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_thesaurus
 * 
 * @callback Scrutari.Ajax~loadThesaurusArrayCallback
 * @param {Array} thesaurusArray
 */

/**
 * Fonction de retour après chargement d'une requête type=motcle. Le paramètre
 * de la fonction est le tableau des mots-clés tel que définit
 * par http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_motcle
 * 
 * @callback Scrutari.Ajax~loadMotcleArrayCallback
 * @param {Array} motcleArray
 */

/**
 * Fonction de retour après chargement d'une requête type=fiche. Le paramètre
 * de la fonction est le tableau des mots-clés tel que définit
 * par http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_fiche
 * 
 * @callback Scrutari.Ajax~loadFicheArrayCallback
 * @param {Array} ficheArray
 */

/**
 * Fonction de retour après chargement d'une requête type=category. Le paramètre
 * de la fonction est le tableau des catégories tel que définit
 * par http://www.scrutari.net/dokuwiki/serveurscrutari:json:type_category
 * 
 * @callback Scrutari.Ajax~loadCategoryArrayCallback
 * @param {Array} categoryArray
 */

/**
 * Fonction de retour après chargement d'une requête type=geojson. Le paramètre
 * de la fonction est constituée des données complètes retournées par le serveur
 * (suivant le format JeoSon)
 * 
 * @callback Scrutari.Ajax~loadGeoJsonCallback
 * @param {Object} data
 */