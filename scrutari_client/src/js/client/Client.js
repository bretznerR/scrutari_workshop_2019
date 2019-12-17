/* global Scrutari,SCRUTARI_L10N,SCRUTARI_HTML */

/***************************************************************
 * ScutariJs
 * Copyright (c) 2014-2017 Vincent Calame - Exemole
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */

/**
 * @constructor
 * @param {Scrutari.Config} scrutariConfig
 * @param {String} clientId
 */
Scrutari.Client = function (scrutariConfig, clientId) {
    this.scrutariConfig = scrutariConfig;
    this.clientId = clientId;
    this.scrutariMeta = null;
    this.stats = null;
    this.isWaiting = false;
    this.mainCurrentScrutariResult = null;
    this.currentScrutariResult = null;
    this.options = {
        withCorpus: false,
        baseSort: "fiche-count",
        corpusSort: "fiche-count",
        categorySort: "rank",
        langSort: "code",
        initialQuery: "",
        initialQId: "",
        initialFilters: null,
        permalinkPattern: null,
        ficheTarget: "_blank",
        ignoreIcon: false,
        ignoreThumbnail: false,
        mainTitle: null,
        paginationChangeCallback: null,
        templateFactory: null
    };
    this._locInstance = new Scrutari.Loc();
    this._ignoreArray = new Array();
    this._structureMap = {};
    this._templateMap = {};
    this._scrutariResultMap = {};
    this._historyNumber = 0;
    this._modalFunction = function ($modal, action) {
        
    };
    if (typeof SCRUTARI_L10N !== 'undefined') {
        this._locInstance.putAll(SCRUTARI_L10N);
    }
    if (typeof SCRUTARI_HTML !== 'undefined') {
        this._htmlObject = SCRUTARI_HTML;
    }
    if (typeof SCRUTARI_FRAMEWORKINIT === 'function') {
        SCRUTARI_FRAMEWORKINIT(this);
    }
};

/**
 * 
 * @param {String} locKey
 * @returns {String}
 */
Scrutari.Client.prototype.loc = function (locKey) {
    return this._locInstance.loc(locKey);
};

/**
 * 
 * @param {String} qId
 * @returns {String}
 */
Scrutari.Client.prototype.toPermalink = function (qId) {
    if (this.options.permalinkPattern) {
        return this.scrutariConfig.getPermalinkUrl(qId, this.options.permalinkPattern);
    }
    return null;
};

/**
 * 
 * @param {String} historyName
 * @param {Scrutari.Result} scrutariResult
 * @returns {undefined}
 */
Scrutari.Client.prototype.storeResult = function (historyName, scrutariResult) {
    this._scrutariResultMap[historyName] = scrutariResult;
};

/**
 * 
 * @param {String} historyName
 * @returns {undefined}
 */
Scrutari.Client.prototype.unstoreResult = function (historyName) {
    this._scrutariResultMap[historyName] = null;
};

Scrutari.Client.prototype.getResult = function (historyName) {
    if (this._scrutariResultMap.hasOwnProperty(historyName)) {
        return this._scrutariResultMap[historyName];
    } else {
        return null;
    }
};

/**
 * 
 * @returns {Number}
 */
Scrutari.Client.prototype.newHistoryNumber = function () {
    this._historyNumber++;
    return this._historyNumber;
};

/**
 * 
 * @param {String} elementName
 * @returns {Boolean}
 */
Scrutari.Client.prototype.ignoreElement = function (elementName) {
    return $.inArray(elementName, this._ignoreArray) > -1;
};

/**
* @param {String} templateName
* @returns {Function}
*/
Scrutari.Client.prototype.getTemplate = function (templateName) {
    if (this.options.templateFactory) {
        if ($.isFunction(this.options.templateFactory)) {
            var template = this.options.templateFactory(this, templateName);
            if (template) {
                return template;
            }
        } else if ($.isArray(this.options.templateFactory)) {
            var factoryLength = this.options.templateFactory.length;
            if (factoryLength > 0) {
                for(var i = (factoryLength -1); i >= 0; i--) {
                    var templateFactory = this.options.templateFactory[i];
                    var template = templateFactory(this, templateName);
                    if (template) {
                        return template;
                    }
                }
            }
        }
    }
    if (templateName.indexOf(":") === -1) {
        templateName = "scrutari:" + templateName;
    }
    var template = $.templates[templateName];
    if (!template) {
        return function () {
            return "Unknown template : " + templateName;
        };
    } else {
        return template;
    }
};

Scrutari.Client.prototype.render = function (templateName, context, helpers) {
    var templateFunction = this.getTemplate(templateName);
    return templateFunction(context, helpers);
};

Scrutari.Client.prototype.$area = function (name, action) {
    var $area = Scrutari.$({scrutariArea: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($area);
                break;
            case 'hide':
                this.hide($area);
                break;
        }
    }
    return $area;
};

Scrutari.Client.prototype.$block = function (name, action) {
    var $block = Scrutari.$({scrutariBlock: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($block);
                break;
            case 'hide':
                this.hide($block);
                break;
        }
    }
    return $block;
};

Scrutari.Client.prototype.$button = function (name, action, option) {
    var $button = Scrutari.$({scrutariButton: name});
    if (action) {
        switch(action) {
            case 'on':
                $button.prop('disabled', false);
                break;
            case 'off':
                $button.prop('disabled', true);
                break;
            case 'show':
                this.show ($button);
                break;
            case 'hide':
                this.hide($button);
                break;
            case 'onclick':
                $("#" + this.clientId).on("click", Scrutari.toCssQuery({scrutariButton: name}), option);
                break;
                
        }
    }
    return $button;
};

Scrutari.Client.prototype.$count = function (name, action, value) {
    var $count = Scrutari.$({scrutariCount: name});
    if (action) {
        switch(action) {
            case 'update':
                if (!value) {
                    value = 0;
                }
                Scrutari.$($count, {scrutariRole: "value"}).html(this.formatNumber(value));
                break;
        }
    }
    return $count;
};

Scrutari.Client.prototype.$form = function (name) {
    return Scrutari.$({scrutariForm: name});
};

Scrutari.Client.prototype.$group = function (name) {
    return Scrutari.$({scrutariGroup: name});
};

Scrutari.Client.prototype.$hidden = function (name, action) {
    var $hidden = Scrutari.$({scrutariHidden: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($hidden);
                break;
            case 'hide':
                this.hide($hidden);
                break;
        }
    }
    return $hidden;
};

Scrutari.Client.prototype.$input = function (name, value) {
    if (value) {
        return Scrutari.$({_element: "input", _name: name, _value: value});
    } else {
        return Scrutari.$({_element: "input", _name: name});
    }
};

Scrutari.Client.prototype.$input_checked = function (name, value) {
    if (value) {
        return Scrutari.$({_element: "input", _name: name, _value: value, _checked: true});
    } else {
        return Scrutari.$({_element: "input", _name: name, _checked: true});
    }
};

Scrutari.Client.prototype.$label = function (name) {
    return Scrutari.$({scrutariLabel: name});
};

Scrutari.Client.prototype.$link = function (name) {
    return Scrutari.$({scrutariLink: name});
};

Scrutari.Client.prototype.$modal = function (name, action) {
    var $modal = Scrutari.$({scrutariModal: name});
    if (action) {
        this._modalFunction($modal, action);
    }
    return $modal;
};

Scrutari.Client.prototype.$panel = function (name, action) {
    var $panel = Scrutari.$({scrutariPanel: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($panel);
                break;
            case 'hide':
                this.hide($panel);
                break;
        }
    }
    return $panel;
};

Scrutari.Client.prototype.$title = function (name, action) {
    var $title = Scrutari.$({scrutariTitle: name});
    if (action) {
        switch(action) {
            case 'show':
                this.show ($title);
                break;
            case 'hide':
                this.hide($title);
                break;
        }
    }
    return $title;
};

Scrutari.Client.prototype.show  = function ($elements) {
    $elements.removeClass("scrutari-Hidden");
};

Scrutari.Client.prototype.hide = function ($elements) {
    $elements.addClass("scrutari-Hidden");
};

Scrutari.Client.prototype.scrollToResult = function () {
    $(window).scrollTop(this.$area('result').offset().top);
};

Scrutari.Client.prototype.getStructureHtml = function (name) {
    if (this._structureMap.hasOwnProperty(name)) {
        return this._structureMap[name];
    } else {
        Scrutari.log("Unknown structure: " + name);
        return "";
    }
};

Scrutari.Client.prototype.getTemplateHtml = function (name) {
    if (this._templateMap.hasOwnProperty(name)) {
        return this._templateMap[name];
    } else {
        Scrutari.log("Unknown template: " + name);
        return "";
    }
};

Scrutari.Client.prototype.formatNumber = function (number) {
    if (Number.prototype.toLocaleString) {
        return number.toLocaleString(this.scrutariConfig.lang);
    } else {
        return number;
    }
};

/**
 * 
 * @param {Scrutari.Config} scrutariConfig
 * @param {String} clientId
 * @param {Object} options
 * @param {Scrutari.Client~initCallback} callback
 * @returns {Scrutari.Client}
 */
Scrutari.Client.init = function (scrutariConfig, clientId, options, callback) {
    if (!$.templates) {
        throw new Error("JsRender is not installed");
    }
    $.views.helpers("scrutari_mark", function(markArray) {
        return Scrutari.Utils.mark(markArray);
    });
    Scrutari.Meta.load(scrutariConfig, function (scrutariMeta) {
        var client = new Scrutari.Client(scrutariConfig, clientId);
        $.views.helpers({
            scrutari_client: client,
            scrutari_loc:  function(key) {
                return client.loc(key);
            },
            scrutari_format: function(number) {
                return client.formatNumber(number);
             }
        });
        client.scrutariMeta = scrutariMeta;
        client.stats = new Scrutari.Stats(scrutariMeta);
        _checkOptions(client, options, scrutariMeta);
        _initMaps(client);
        Scrutari.Client.Ui.init(client);
        if (callback) {
            callback(client);
        }
    });
    
    
    function _checkOptions (client, options, scrutariMeta) {
        var defaultOptions = scrutariMeta.getDefaultOptions();
        for(var key in defaultOptions) {
            client.options[key] = defaultOptions[key];
        }
        if (options) {
            for(var key in options) {
                client.options[key] = options[key];
            }
        }
        if (options.locMap) {
            client._locInstance.putAll(options.locMap);
        }
        if (options.ignoreList) {
            var ignoreList = options.ignoreList;
            var ignoreArray;
            if ($.type(ignoreList) === "string") {
                ignoreArray = ignoreList.split(",");
            } else if ($.isArray(ignoreList)) {
                ignoreArray = ignoreList;
            }
            if (ignoreArray) {
                for(var i = 0, len = ignoreArray.length; i < len; i++) {
                    client._ignoreArray.push($.trim(ignoreArray[i]));
                }
            }
        }
    }
    
    function _initHtmlObject (client, htmlObject) {
        if (htmlObject) {
            if (htmlObject.structure) {
                for(var key in htmlObject.structure) {
                    client._structureMap[key] = htmlObject.structure[key];
                }
            }
            if (htmlObject.templates) {
                for(var key in htmlObject.templates) {
                    client._templateMap[key] = htmlObject.templates[key];
                }
            }
        }
    }
    
    function _initMaps (client) {
        _initHtmlObject(client, client._htmlObject);
        _initHtmlObject(client, options.htmlObject);
        $("script[type='text/x-scrutari-structure']").each(function (index, element) {
            var $element = $(element);
            client._structureMap[$element.data("name")] = $element.html();
        });
        $("script[type='text/x-scrutari-template']").each(function (index, element) {
            var $element = $(element);
            client._templateMap[$element.data("name")] = $element.html();
        });
        for(var name in client._templateMap) {
            var templateText = client._templateMap[name];
            templateText = templateText.replace(/tmpl=\"([-_0-9a-z]+)\"/g, 'tmpl="scrutari:$1"');
            $.templates("scrutari:" + name, templateText);
        }
    }    
        
};


/**
 * 
 * @callback Scrutari.Client~initCallback
 * @param {Scrutari.Client} client
 */


/**
 * 
 * @function Scrutari.Client~templateFactory
 * @param {Scrutari.Client} client
 * @param {String} templateName
 */
