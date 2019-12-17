/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2016 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Objet global définissant l'espace de nom Scrutari
 * 
 * @namespace Scrutari
 */
var Scrutari = {};

/**
 * Fonction de retour en cas d'erreur indiquée par le moteur Scrutari.
 * L'objet tranmis suit l'API du moteur Scrutari
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:messages 
  * 
 * @callback apiErrorCallback
 * @param {Object} error
 */


/**
 * Affiche le message dans la console si elle est opérationnelle.
 * 
 * @param {String} msg Message à afficher
 * @returns {undefined}
 */
Scrutari.log = function (msg) {
    if ((console) && (console.log)) {
        console.log(msg);
    }
};

/**
 * Affiche l'erreur dans la console si elle est opérationnelle.
 * L'argument est un objet correspondant à l'API du moteur Scrutari
 * http://www.scrutari.net/dokuwiki/serveurscrutari:json:messages 
 * 
 * @param {Object} error Objet décrivant l'erreur suivant l'API de Scrutari
 * @returns {undefined}
 */
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

/**
 * Convertit l'argument en objett JQuery. S'il s'agit déjà d'un objet JQuery, il
 * est simplement retourné.
 * 
 * @param {JQuery|String|Object} jqArgument
 * @returns {JQuery} Objet JQUery résultant
 */
Scrutari.convert = function (jqArgument) {
    if (jqArgument.jquery) {
        return jqArgument;
    } else {
        return $(jqArgument);
    }
};

/**
 * Vérifie si l'ensemble est non vide.
 * 
 * @param {JQuery|String|Object} jqArgument
 * @returns {boolean} si length > 0
 */
Scrutari.exists = function (jqArgument) {
    return Scrutari.convert(jqArgument).length > 0;
};

 /**
  * Remplace les caractères spéciaux par leurs entités HTML afin d'éviter
  * l'insertion de code HTML indésirables.
  * 
  * @param {String} text Texte à échapper
  * @returns {String] Texte échappé
  */
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