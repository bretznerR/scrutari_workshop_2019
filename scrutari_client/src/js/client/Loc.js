/* global Scrutari */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2016 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Cosntructeur d'un objet Scrutari.Loc.
 * L'argument unique est un objet jouant le rôle de tableau associatif, les noms
 * de ses propriétés étant les clés de localisation les valeurs de ces propriétés
 * étant censées être des chaines.
 * 
 * @constructor
 * @param {Object} [map] objet jouant le rôle de tableau associatif
 */
Scrutari.Loc = function (map) {
    if (map) {
        this.map = map;
    } else {
        this.map = new Object();
    }
};

/**
 * Remplit le tableau de localisation avec les valeurs des propriétés de l'object
 * map (ces valeurs étant censées être des chaines).
 * Si la clé existe déjà, l'ancienne valeur est remplacée.
 *  
 * @param {Object} map objet jouant le rôle de tableau associatif
 * @returns {undefined}
 */
Scrutari.Loc.prototype.putAll = function (map) {
    for(var key in map) {
        this.map[key] = map[key];
    }
};

/**
 * Indique le texte de localisation  pour une clé donnée.
 * 
 * @param {String} locKey la clé de localisation
 * @param {String} locText le text de localisation
 * @returns {undefined}
 */
Scrutari.Loc.prototype.putLoc = function (locKey, locText) {
    this.map[locKey] = locText;
};

/**
 * Localise le texte indiqué par la clé de localisation.
 * Cette fonction peut prendre des arguments supplémentaires qui seront placés
 * dans le texte résultant aux endroits indiqués sous la forme {0},{1}, etc.
 * (le chiffre indiquant le numéro de l'argument supplémentaire, en comptant à partir
 * de zéro)
 * 
 * @param {String} locKey la clé de localisation
 * @returns {String} le texte localisé
 */
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

/**
 * Localise la clé et échappe le texte résultant.
 * Comme Scrutari.loc, cette fonction peut prendre des arguments supplémentaires
 * qui seront placés dans le texte résultant.
 * 
 * @param {String} locKey la clé de localisation
 * @returns {String} le texte localisé et échappé
 */
Scrutari.Loc.prototype.escape = function (locKey) {
    return Scrutari.escape(this.loc.apply(this, arguments));
};

