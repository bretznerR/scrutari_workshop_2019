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

