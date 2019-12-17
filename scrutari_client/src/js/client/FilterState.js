/* global Scrutari */

/**
 * @constructor
 */
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

