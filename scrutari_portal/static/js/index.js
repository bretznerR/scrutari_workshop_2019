/*
 * Pour le formatage, voir https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat */

function renderLogos(scrutariMeta) {
    var ficheCount = scrutariMeta.getGlobalFicheCount();
    var baseArray = scrutariMeta.getBaseArray();
    var baseCount = baseArray.length;
    if ((Intl) && (Intl.NumberFormat)) {
        var numberFormat = new Intl.NumberFormat("fr");
        ficheCount = numberFormat.format(ficheCount);
        baseCount = numberFormat.format(baseCount);
    }
    var bases = new Array();
    for(var i = 0, len = baseArray.length; i < len; i++) {
        var apiBase = baseArray[i];
        if (!apiBase.baseicon) {
            continue;
        }
        bases.push(apiBase);
    }
    $("#logosRow").html($.templates["logos"]({ficheCount: ficheCount, baseCount: baseCount, bases: bases}));
    
}

function renderFiches(ficheArray) {
    $("#randomList").html($.templates["fiches"]({fiches: ficheArray}));
}