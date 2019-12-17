var SCRUTARI_HTML = {
_name:'none',
structure:{
'area-input':'<div data-scrutari-area="input"> <div class="none-input-Container"> <div class="none-input-Search"> <input type="text" class="scrutari-input-Text" size="40" name="q" value=""> </div> <div class="none-input-Submit"> <button type="submit">_ button_submit</button> </div> <div class="none-input-Parameters"> <button type="button" data-scrutari-button="parametersDisplay" class="scrutari-Hidden" data-scrutari-state="off"> _ button_parameters </button> </div> </div> </div>',
'area-parameters':'<div data-scrutari-area="parameters" class="scrutari-area-Parameters scrutari-Hidden"> {{panel-options}} {{panel-corpus}} {{panel-base}} {{panel-lang}} {{panel-category}} <div class="scrutari-area-Resubmit"> <button type="submit">_ button_resubmit</button> </div> </div>',
'area-result':'<div data-scrutari-area="result" class="scrutari-area-Result"> <div class="none-result-Container"> <div class="none-result-FicheDisplay" data-scrutari-block="ficheDisplay"> </div> <div class="none-result-Sidebar"> <div class="scrutari-Hidden" data-scrutari-hidden="empty"> {{result-links}} </div> {{result-history}} </div> </div> <div class="scrutari-Hidden" data-scrutari-hidden="threshold"> {{result-subsearch}} </div> <div class="scrutari-Hidden" data-scrutari-hidden="empty"> {{result-poweredby}} </div> </div>',
'area-stats':'<div data-scrutari-area="stats" class="scrutari-area-Stats"> {{stats-table}} </div> ',
'area-title':'<div data-scrutari-area="title" class="scrutari-area-Title"> <p class="scrutari-title-Main" data-scrutari-title="main"></p> </div> ',
'modal-help_mode':'<div class="scrutari-Hidden" data-scrutari-modal="help_mode" aria-hidden="true"> <div data-none-role="header"> <p>_ mode_help</p> </div> <div data-none-role="content"> _ help_mode.html </div> </div>',
'modal-help_periode':'<div class="scrutari-Hidden" data-scrutari-modal="help_periode" aria-hidden="true"> <div data-none-role="header"> _ periode_help </div> <div data-none-role="content"> _ help_periode.html </div> </div>',
'modal-help_ponderation':'<div class="scrutari-Hidden" data-scrutari-modal="help_ponderation" aria-hidden="true"> <div data-none-role="header"> _ ponderation_help </div> <div data-none-role="content"> _ help_ponderation.html </div> </div>',
'modal-loading':'<div class="scrutari-Hidden" data-scrutari-modal="loading" aria-hidden="true"> <div data-none-role="content"> <span class="scrutari-icon-Loader"></span> _ loading_search </div> </div>',
'panel-base':'<div class="scrutari-panel-Div scrutari-Hidden" data-scrutari-panel="base"> <div class="scrutari-panel-Heading"> <p class="scrutari-panel-Title" data-scrutari-button="blockDisplay" data-scrutari-state="off" data-scrutari-target="basePanelBody"> _ title_filter_base <span data-scrutari-label="baseFilter" class="scrutari-panel-State scrutari-Disabled" data-scrutari-alternate="_ filter_on">_ filter_off</span> </p> </div> <div class="scrutari-panel-WithTools scrutari-Hidden" data-scrutari-block="basePanelBody"> <div class="none-panel-Toolbar"> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="baseEnable" data-scrutari-state="off"> <span data-scrutari-alternate="_ button_filter_off">_ button_filter_on</span> </button> </span> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="baseCheckAll" disabled>_ button_check_all</button> <button type="button" data-scrutari-button="baseUncheckAll" disabled>_ button_uncheck_all</button> </span> </div> <div class="none-panel-Columns"> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="baseColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="baseColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="baseColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="baseColumns"></div> </div> </div> </div>',
'panel-category':'<div class="scrutari-panel-Div scrutari-Hidden" data-scrutari-panel="category"> <div class="scrutari-panel-Heading"> <p class="scrutari-panel-Title" data-scrutari-button="blockDisplay" data-scrutari-state="off" data-scrutari-target="categoryPanelBody"> _ title_filter_category <span data-scrutari-label="categoryFilter" class="scrutari-panel-State scrutari-Disabled" data-scrutari-alternate="_ filter_on">_ filter_off</span> </p> </div> <div class="scrutari-panel-WithTools scrutari-Hidden" data-scrutari-block="categoryPanelBody"> <div class="none-panel-Toolbar"> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="categoryEnable" data-scrutari-state="off"> <span data-scrutari-alternate="_ button_filter_off">_ button_filter_on</span> </button> </span> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="categoryCheckAll" disabled>_ button_check_all</button> <button type="button" data-scrutari-button="categoryUncheckAll" disabled>_ button_uncheck_all</button> </span> </div> <div class="none-panel-Columns"> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="categoryColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="categoryColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="categoryColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="categoryColumns"></div> </div> </div> </div>',
'panel-corpus':'<div class="scrutari-panel-Div scrutari-Hidden" data-scrutari-panel="corpus"> <div class="scrutari-panel-Heading"> <p class="scrutari-panel-Title" data-scrutari-button="blockDisplay" data-scrutari-state="off" data-scrutari-target="corpusPanelBody"> _ title_filter_corpus <span data-scrutari-label="corpusFilter" class="scrutari-panel-State scrutari-Disabled" data-scrutari-alternate="_ filter_on">_ filter_off</span> </p> </div> <div class="scrutari-panel-WithTools scrutari-Hidden" data-scrutari-block="corpusPanelBody"> <div class="none-panel-Toolbar"> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="corpusEnable" data-scrutari-state="off"> <span data-scrutari-alternate="_ button_filter_off">_ button_filter_on</span> </button> </span> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="corpusCheckAll" disabled>_ button_check_all</button> <button type="button" data-scrutari-button="corpusUncheckAll" disabled>_ button_uncheck_all</button> </span> </div> <div class="none-panel-Columns"> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="corpusColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="corpusColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="corpusColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="corpusColumns"></div> </div> </div> </div>',
'panel-lang':'<div class="scrutari-panel-Div scrutari-Hidden" data-scrutari-panel="lang"> <div class="scrutari-panel-Heading"> <p class="scrutari-panel-Title" data-scrutari-button="blockDisplay" data-scrutari-state="off" data-scrutari-target="langPanelBody"> _ title_filter_lang <span data-scrutari-label="langFilter" class="scrutari-panel-State scrutari-Disabled" data-scrutari-alternate="_ filter_on">_ filter_off</span> </p> </div> <div class="scrutari-panel-WithTools scrutari-Hidden" data-scrutari-block="langPanelBody"> <div class="none-panel-Toolbar"> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="langEnable" data-scrutari-state="off"> <span data-scrutari-alternate="_ button_filter_off">_ button_filter_on</span> </button> </span> <span class="none-panel-ButtonGroup"> <button type="button" data-scrutari-button="langCheckAll" disabled>_ button_check_all</button> <button type="button" data-scrutari-button="langUncheckAll" disabled>_ button_uncheck_all</button> </span> </div> <div class="none-panel-Columns"> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="langColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="langColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="langColumns"></div> <div class="scrutari-panel-ColumnDisabled" data-scrutari-group="langColumns"></div> </div> </div> </div>',
'panel-options':'<div class="scrutari-panel-Div" data-scrutari-panel="options"> <div class="scrutari-panel-Heading"> <p class="scrutari-panel-Title" data-scrutari-button="blockDisplay" data-scrutari-state="off" data-scrutari-target="optionsPanelBody"> _ title_options </p> </div> <div class="scrutari-Hidden" data-scrutari-block="optionsPanelBody"> <div class="none-panel-Columns"> <div> <p>_ mode_title<br/><button data-scrutari-button="modeHelp" type="button" title="_ mode_help">?</button></p> <p><label class="scrutari-Label"><input type="radio" name="q-mode" value="intersection" checked> _ mode_intersection</label></p> <p><label class="scrutari-Label"><input type="radio" name="q-mode" value="union"> _ mode_union</label></p> <p><label class="scrutari-Label"><input type="radio" name="q-mode" value="operation"> _ mode_operation</label></p> <p><label class="scrutari-Label"><input type="checkbox" name="wildchar" value="end" checked> _ wildchar_end</label></p> </div> <div> <p>_ ponderation_title<br/><button data-scrutari-button="ponderationHelp" type="button" title="_ ponderation_help">?</button></p> <p><label class="scrutari-Label"><input type="radio" name="ponderation" value="pertinence" checked> _ ponderation_pertinence</label></p> <p><label class="scrutari-Label"><input type="radio" name="ponderation" value="date"> _ ponderation_date</label></p> </div> <div> <p>_ periode_title<br/><button data-scrutari-button="periodeHelp" type="button" title="_ periode_help">?</button></p> <p><input type="text" class="scrutari-input-Text" name="periode" value="" size="20"></p> </div> </div> </div> </div>',
'main-form':'<form data-scrutari-form="mainsearch"> {{area-input}} {{area-parameters}} </form>',
'main':'{{area-title}} {{main-form}} {{area-stats}} {{area-result}} {{modal-loading}} {{modal-help_mode}} {{modal-help_ponderation}} {{modal-help_periode}}',
'result-history':'<div class="scrutari-Hidden" data-scrutari-hidden="start"> <p class="scrutari-links-Title">_ title_history</p> <div data-scrutari-block="historyList"> </div> </div>',
'result-links':'<p class="scrutari-links-Title">_ title_share</p> <p class="scrutari-links-Permalink"><a href="#" data-scrutari-link="permalink" target="_blank" title="_ link_permalink" ></a> </p> <p class="scrutari-links-Title">_ title_download</p> <p> <a href="#" data-scrutari-link="ods" target="_blank" title="_ link_ods" class="scrutari-links-ButtonLike">ods</a> <a href="#" data-scrutari-link="csv" target="_blank" title="_ link_csv" class="scrutari-links-ButtonLike">csv</a> </p> <p class="scrutari-links-Title">_ title_feed</p> <p> <a href="#" data-scrutari-link="atom" target="_blank" title="_ link_atom" class="scrutari-links-ButtonLike">atom</a> </p>',
'result-poweredby':'<p class="scrutari-links-Poweredby"><a href="http://www.scrutari.net" target="_blank"><span class="scrutari-icon-Logo"></span> _ link_poweredby</a></p>',
'result-subsearch':'<form data-scrutari-form="subsearch"> <p class="scrutari-subsearch-Title">_ title_subsearch</p> <input type="text" class="scrutari-input-Text" size="40" name="q"> <button type="submit">_ button_subsearch</button> </form>',
'stats-filter':'<tr class="scrutari-Hidden" data-scrutari-hidden="filter" data-scrutari-count="stats-filter"> <td class="scrutari-stats-Cell"><abbr class="scrutari-stats-Abbr" title="_ stats_filter_title">_ stats_filter_short</abbr></td> <td class="scrutari-stats-Cell scrutari-stats-Number"><span class="scrutari-stats-Count" data-scrutari-role="value"></span></td> <td class="scrutari-stats-Cell scrutari-stats-Titles"><span data-scrutari-role="titles"></span></td> </tr>',
'stats-global':'<tr class="scrutari-Hidden" data-scrutari-hidden="init" data-scrutari-count="stats-global"> <td class="scrutari-stats-Cell"><abbr class="scrutari-stats-Abbr" title="_ stats_global_title">_ stats_global_short</abbr></td> <td class="scrutari-stats-Cell scrutari-stats-Number"><span class="scrutari-stats-Count" data-scrutari-role="value"></span></td> </tr>',
'stats-result':'<tr class="scrutari-Hidden" data-scrutari-hidden="start" data-scrutari-count="stats-result"> <td class="scrutari-stats-Cell"><abbr class="scrutari-stats-Abbr" title="_ stats_result_title">_ stats_result_short</abbr></td> <td class="scrutari-stats-Cell scrutari-stats-Number"><span class="scrutari-stats-Count" data-scrutari-role="value"></span></td> </tr>',
'stats-table':'<table class="scrutari-stats-Table"> {{stats-global}} {{stats-filter}} {{stats-result}} </table> '
},
templates:{
'base':' <p> <label class="scrutari-Label" {{if phraseMap.longtitle}}title="{{> phraseMap.longtitle}}"{{/if}}><input type="checkbox" name="base" value="{{: codebase}}" data-scrutari-title="{{> title}}"> {{if baseicon}} <img src="{{: baseicon}}" alt="" class="scrutari-panel-Icon"> {{/if}} <span data-scrutari-role="stat-text">{{> title}} <small>(<span data-scrutari-stat-type="base" data-scrutari-stat-key="{{: codebase}}" data-scrutari-stat-default="{{: stats.fiche}}"></span>{{: ~scrutari_format(stats.fiche)}})</small></span> </label> </p>',
'category':' <p> <label class="scrutari-Label" {{if phraseMap.description}}title="{{> phraseMap.description}}"{{/if}}> <input type="checkbox" name="category" value="{{: name}}" data-scrutari-title="{{> title}}"> <span data-scrutari-role="stat-text">{{> title}} <small>(<span data-scrutari-stat-type="category" data-scrutari-stat-key="{{: name}}" data-scrutari-stat-default="{{: stats.fiche}}"></span>{{: ~scrutari_format(stats.fiche)}})</small></span> </label> </p>',
'categoryfichedisplay':'<div class="scrutari-category-List" role="tablist"> {{for array}} <span role="tab" class="scrutari-category-Tab {{if active}}scrutari-On{{/if}}" data-scrutari-role="category-tab" data-scrutari-button="categoryTab" {{if category.phraseMap.description}}title="{{>category.phraseMap.description}}"{{/if}} data-scrutari-category="{{:category.name}}"> {{>category.title}} ({{:fichestat}}) </span> {{/for}} </div> {{for array}} <div class="scrutari-category-Content {{if !active}}scrutari-Hidden{{/if}}" data-scrutari-role="category-content" data-scrutari-category="{{:category.name}}"> <div data-scrutari-block="topPagination_{{:category.name}}"></div> <div data-scrutari-block="fiches_{{:category.name}}"></div> <div data-scrutari-block="bottomPagination_{{:category.name}}"></div> </div> {{/for}}',
'corpus':' <p> <label class="scrutari-Label"><input type="checkbox" name="corpus" value="{{: codecorpus}}" data-scrutari-title="{{> title}}"> <span data-scrutari-role="stat-text">{{> title}} <small>(<span data-scrutari-stat-type="corpus" data-scrutari-stat-key="{{: codecorpus}}" data-scrutari-stat-default="{{: stats.fiche}}"></span>{{: ~scrutari_format(stats.fiche)}})</small></span> </label> </p>',
'emptyfichedisplay':'<p><em>{{>~scrutari_loc("_ result_none")}}</em></p> {{if withFilter}} <p><em>{{>~scrutari_loc("_ result_fitlerwarning")}}</em></p> {{else scrutariResult.searchMeta.reportArray.length > 0}} <p>Analyse des termes de la recherche{{>~scrutari_loc("_ colon")}}</p> <dl> {{for scrutariResult.searchMeta.reportArray}} <dt>{{> text}}</dt> <dl> {{if canonicalArray.length > 0}} <p>Correspondances trouvées (entre parenthèses, le nombre d\'occurrences par langue): </p> <ul> {{for canonicalArray}} <li> {{> canonical}} ({{for langreportArray}}{{if #index > 0}}, {{/if}}{{: lang}}={{: ficheCount}}{{/for}}) </li> {{/for}} </ul> {{/if}} {{if neighbourArray.length > 0}} <p>Pas de correspondances trouvées. Termes se rapprochant (entre parenthèses, le code des langues concernées) : </p> <ul> {{for neighbourArray}} <li> {{> neighbour}} <small>({{for langArray}}{{if #index > 0}}, {{/if}}{{: #data}}{{/for}})</small> </li> {{/for}} </ul> {{/if}} {{if canonicalArray.length == 0 && neighbourArray.length == 0}} <p>Aucune correspondance ou terme voisin trouvé</p> {{/if}} </dl> {{/for}} </dl> {{/if}}',
'fiche':' <div class="scrutari-fiche-Block" data-scrutari-block="fiche_{{:codefiche}}"> {{if _thumbnail}} <div class="scrutari-fiche-Thumbnail"> <img class="scrutari-fiche-ThumbnailImg" alt="" src="{{:_thumbnail}}"/> {{if _icon}} <img class="scrutari-fiche-ThumbnailIcon" alt="" src="{{:_icon}}"/> {{/if}} </div> {{else _icon}} <div class="scrutari-fiche-Icon"><img alt="" src="{{:_icon}}"/></div> {{/if}} <div class="scrutari-fiche-Body {{if _thumbnail}}scrutari-fiche-ThumbnailBody{{/if}}"> <p class="scrutari-fiche-Titre"> <a href="{{:href}}" class="scrutari-fiche-Link" data-scrutari-link="fiche_{{:codefiche}}" {{if _target}} target="{{:_target}}"{{/if}}> {{if mtitre}} {{:~scrutari_mark(mtitre)}} {{else}} {{:href}} {{/if}} </a> </p> {{if msoustitre}} <p class="scrutari-fiche-Soustitre"> {{:~scrutari_mark(msoustitre)}} </p> {{/if}} {{if year}} <p class="scrutari-fiche-Year"> {{:year}} </p> {{/if}} {{if _primaryAttributeArray}} {{for _primaryAttributeArray tmpl="fiche_attributes" /}} {{/if}} {{if mcomplementArray}} {{for mcomplementArray}} <p class="scrutari-fiche-Complement"> <span class="scrutari-label-Complement"> {{>title}} {{>~scrutari_loc("_ colon")}} </span> {{:~scrutari_mark(mvalue)}} </p> {{/for}} {{/if}} {{if _secondaryAttributeArray}} {{for _secondaryAttributeArray tmpl="fiche_attributes" /}} {{/if}} {{if _motcleArray}} <p class="scrutari-fiche-Motcle"> <span class="scrutari-label-Motcle"> {{if _motcleArray.length == 1}} {{>~scrutari_loc("_ fiche_motscles_one")}} {{else}} {{>~scrutari_loc("_ fiche_motscles_many")}} {{/if}} </span> {{for _motcleArray ~len=_motcleArray.length}} {{if mlabelArray}}{{for mlabelArray}}{{if #index > 0}}/{{/if}}{{:~scrutari_mark(mvalue)}}{{/for}}{{/if}}{{if #index != (~len -1)}}, {{/if}} {{/for}} </p> {{/if}} </div> </div> ',
'fiche_attributes':'<p class="scrutari-fiche-Attribute"> <span class="scrutari-label-Attribute">{{>title}}{{>~scrutari_loc("_ colon")}}</span> {{if type!=="block"}} {{for valueArray ~len=valueArray.length}} {{:~scrutari_mark(#data)}}{{if #index != (~len -1)}}, {{/if}} {{/for}} {{/if}} </p> {{if type==="block"}} <p class="scrutari-fiche-AttrBlocks">…<br/> {{for valueArray ~len=valueArray.length}} {{if #index > 0}}<br/>…<br/>{{/if}} {{:~scrutari_mark(#data)}} {{/for}} <br/>…</p> {{/if}}',
'ficheloading':'<span class="scrutari-icon-Loader"></span> {{>~scrutari_loc(\'_ loading_pagination\')}}',
'history':'<div data-scrutari-block="{{:name}}" class="scrutari-history-Block scrutari-history-Active"> {{if fichestat > 0}}<a href="javascript:load_{{:name}}" data-scrutari-button="loadHistory" data-scrutari-history-name="{{:name}}">{{/if}} {{>sequence}} ({{:fichestat}}) {{if fichestat > 0}}</a>{{/if}} <button data-scrutari-role="remove" data-scrutari-button="removeHistory" data-scrutari-history-name="{{:name}}" class="scrutari-Hidden" title="{{>~scrutari_loc(\'_ button_remove\')}}"><span aria-hidden="true">&times;</span></button> <br/><span data-scrutari-role="subsearch"></span> </div>',
'lang':' <p> <label class="scrutari-Label"><input type="checkbox" name="lang" value="{{: lang}}" data-scrutari-title="{{: lang}}"> <span data-scrutari-role="stat-text">{{> title}} [{{: lang}}] <small>(<span data-scrutari-stat-type="lang" data-scrutari-stat-key="{{: lang}}" data-scrutari-stat-default="{{: fiche}}"></span>{{: ~scrutari_format(fiche)}})</small></span> </label> </p>',
'tabs':'<div class="scrutari-pagination-List"> {{for tabArray}} {{if state===\'active\'}} <span class="scrutari-pagination-Current">{{>title}}</span> {{else state===\'disabled\'}} <span class="scrutari-pagination-Disabled scrutari-Disabled">{{>title}}</span> {{else}} <span class="scrutari-pagination-Tab" data-scrutari-button="ficheTab" data-scrutari-type="{{:~root.type}}" data-scrutari-position="{{:~root.position}}" data-scrutari-number="{{:number}}" {{if ~root.category}} data-scrutari-category="{{:~root.category}}"{{/if}}>{{>title}}</span> {{/if}} {{/for}} </div>',
'uniquefichedisplay':'<div data-scrutari-block="topPagination"></div> <div data-scrutari-block="fiches"></div> <div data-scrutari-block="bottomPagination"></div> '
}
};

function SCRUTARI_FRAMEWORKINIT (scrutariClient) {
    
    scrutariClient._modalFunction = function ($modal, action) {
        switch(action) {
            case 'show':
                if (!$modal.data("overlayId")) {
                    var overlayId = Overlay.start({
                        header: $modal.children("[data-none-role='header']").html(),
                        content: $modal.children("[data-none-role='content']").html(),
                        closeTooltip: scrutariClient.loc("_ button_close")
                    });
                    $modal.data("overlayId", overlayId);
                }
                break;
            case 'hide':
                Overlay.end($modal);
                $modal.data("overlayId", null);
                break;
        }
    };
    
}

/**
 * Objet global définissant l'espace de nom Overlay
 * 
 * @namespace Overlay
 */
var Overlay = {};

Overlay.idNumber = 1;
Overlay.activeInfoArray = new Array();

$(document).on('keydown.overlay', function(event) {
    if (event.which === 27) {
        var length = Overlay.activeInfoArray.length;
        if (length > 0) {
            var overlayInfo = Overlay.activeInfoArray[length - 1];
            if (overlayInfo.escapeClose) {
                Overlay.end(overlayInfo.overlayId);
            }
        }
    }
});

Overlay.Info = function (overlayId, escapeClose) {
    this.overlayId = overlayId;
    this.escapeClose = escapeClose;
};

Overlay.start = function (settings) {
    var closeTooltip = "Fermer";
    if (settings.closeTooltip) {
        closeTooltip = settings.closeTooltip;
    }
    var overlayIdNumber = Overlay.idNumber;
    Overlay.idNumber++;
    var overlayId = "overlayBlocker_" + overlayIdNumber;
    Overlay.activeInfoArray.push(new Overlay.Info(overlayId, _checkSetting("escapeClose")));
    var $overlayBlocker = $("<div/>").attr("id", overlayId).attr("class", "overlay-Blocker").attr("data-role", "overlay");
    var $overlayDialog = $("<div/>").attr("class", "overlay-Dialog").appendTo($overlayBlocker);
    $overlayDialog.data("overlayId", overlayId);
    $("body")
        .append($overlayBlocker)
        .css('overflow','hidden');
    var overlayBody = "<div class='overlay-panel-Header'></div><div class='overlay-panel-Content'></div><div class='overlay-panel-Footer'><div></div></div>";
    var includeForm = false;
    if (settings.formAttrs || settings.ajaxForm || settings.formSubmit) {
        includeForm = true;
        var $form = $("<form/>");
        if (settings.formAttrs) {
            for(var prop in settings.formAttrs) {
                $form.attr(prop, settings.formAttrs[prop]);
            }
        }
        if (settings.ajaxForm) {
            var initialBeforeSubmit = settings.ajaxForm.beforeSubmit;
            settings.ajaxForm.beforeSubmit = function (arr, $form, options) {
                if ((initialBeforeSubmit) && (initialBeforeSubmit(arr, $form, options) === false)) {
                    return false;
                }
                _startWaiting();
            };
            var initialSuccess = settings.ajaxForm.success;
            settings.ajaxForm.success = function (data, textStatus, jqXHR, $form) {
                _endWaiting();
                initialSuccess(data, textStatus, jqXHR, $form);
            };
            $form.ajaxForm(settings.ajaxForm);
        } else if (settings.formSubmit) {
            $form.submit(function () {
                return settings.formSubmit($(this));
            });
        }
        $overlayDialog.append($form.html(overlayBody));
        $form.data("overlayId", overlayId);
    } else {
        $overlayDialog.html(overlayBody);
    }
    _setContent(".overlay-panel-Header", settings.header);
    _setContent(".overlay-panel-Content", settings.content);
    _setContent(".overlay-panel-Footer > div", settings.footer);
    var clickClose = _checkSetting("clickClose");
    var showClose = _checkSetting("showClose");
    $overlayBlocker
        .click(function() {
            if (clickClose) {
                    Overlay.end(overlayId);
            }
        })
        .data("beforeEnd", settings.beforeEnd)
        .data("afterEnd", settings.afterEnd)
        .css("z-index", 10000 + overlayIdNumber);
    if (showClose) {
        $overlayDialog
            .append("<button data-role='close' class='overlay-button-Close' title='" +  closeTooltip + "'>&times</button>")
            .on("click.overlay", "[data-role='close']", function () {
                Overlay.end(overlayId);
            });
    }
    $overlayDialog
        .click(function (event) {
            event.stopPropagation();
        });
    if (settings.isWaiting) {
        _startWaiting();
    }
    $overlayBlocker.fadeIn(function () {
        $overlayDialog.show();
        if (settings.afterStart) {
            settings.afterStart($overlayDialog);
        } else if (includeForm) {
            $overlayDialog.find(":input").filter("[type!='hidden']").first().trigger("focus");
        }
    });
    
    return overlayId;
    
    function _checkSetting(propName) {
        if (settings.hasOwnProperty(propName)) {
            return settings[propName];
        }
        return true;
    }
    
    function _setContent (selector, content) {
        if (!content) {
            $overlayDialog.find(selector).empty();
        } else if (content.jquery) {
            $overlayDialog.find(selector).empty().append($("<div/>").append(content));
        } else {
            $overlayDialog.find(selector).empty().append($("<div/>").html(content));
        }
    }
    
    function _startWaiting() {
        $overlayBlocker.find("[type='submit']").prop("disabled", true);
        $overlayBlocker.addClass("overlay-Waiting");
    }
    
    function _endWaiting() {
        $overlayBlocker.find("[type='submit']").prop("disabled", false);
        $overlayBlocker.removeClass("overlay-Waiting");
    }
};

Overlay.end = function (overlayId, callback) {
    if (overlayId.jquery) {
        overlayId = overlayId.data("overlayId");
    }
    if (!overlayId) {
        return;
    }
    var $overlayBlocker = $("#" + overlayId);
    var beforeEnd = $overlayBlocker.data("beforeEnd");
    if (beforeEnd) {
        var result = beforeEnd($overlayBlocker.children("div"));
        if (result === false) {
            return;
        }
    }
    _pop();
    $overlayBlocker.empty();
    var afterEnd = $overlayBlocker.data("afterEnd");
    $overlayBlocker.fadeOut(function() {
        $("#" + overlayId).remove();
        if ($("body").children("[data-role='overlay']").length === 0) {
            $("body").css('overflow','');
          }
        if (afterEnd) {
            afterEnd();
        }
        if (callback) {
            callback();
        }
    });
    
    function _pop() {
        for(var i = 0, len = Overlay.activeInfoArray.length; i < len; i++) {
            var overlayInfo = Overlay.activeInfoArray[i];
            if (overlayInfo.overlayId === overlayId) {
                Overlay.activeInfoArray.splice(i, 1);
                break;
            }
        }
    }
};

