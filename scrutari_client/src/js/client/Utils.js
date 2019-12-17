/* global Scrutari */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2017 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * Contient des fonctions utilitaires « statiques ». Aucune de ces fonctions ne doit altérer
 * l'état de leurs arguments ou de variables globales.
 */
Scrutari.Utils = {};

/**
 * Répartit les objets dans objectArray dans l'ensemble des élements HTML définis
 * par jqArgument.
 * objectTemplate est la fonction à utiliser pour produire le code html de l'objet.
 * Elle doit prendre comme argument un objet de objectArray
 */
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

/**
 * Désactive les éléments de selectors
 */
Scrutari.Utils.disable = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('disabled', true);
    return $elements;
};

/**
 * Active les éléments de selectors
 */
Scrutari.Utils.enable = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('disabled', false);
    return $elements;
};

/**
 * Coche les éléments de selectors
 */
Scrutari.Utils.uncheck = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('checked', false);
    return $elements;
};

/**
 * Décoche les éléments de selectors
 */
Scrutari.Utils.check = function (jqArgument) {
    var $elements = Scrutari.convert(jqArgument);
    $elements.prop('checked', true);
    return $elements;
};

/**
 * Bascule de la valeur « on » à « off » ou « off » à « on » pour la clé stateDataKey
 */
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

/**
 * Active ou désactive les éléments au sens HTML (attribut disabled)
 * en fonction de la valeur de state (« off » ou « on »)
 */
Scrutari.Utils.toggle.disabled = function (jqArgument, state) {
    var $elements = Scrutari.convert(jqArgument);
    if (state === 'off') {
        $elements.prop('disabled', true);
    } else {
        $elements.prop('disabled', false);
    }
    return $elements;
};

/**
 * Change le texte actuel par celui de la clé alterDataKey et conserve
 * l'ancienne valeur du texte dans le clé alterDataKey
 */
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

/**
 * Bascule de la classe onClass à offClass si state est égal à « off »
 * ou sinon de la classe offClass à la classe onClass
 */
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

 /**
  * Tableau d'un élément « marqué » (mtitre, mvalue)
  * 
  * @returns {String} Code HTML correspondant
  */
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
