var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require('./view');
var $ = view.$;
var lineMessageView = require('./lineMessageView');
var panelHeaders = {
    error: 'Errors In Open Files',
    build: 'Last Build Output'
};
var gotoHistory = require('../gotoHistory');
var MainPanelView = (function (_super) {
    __extends(MainPanelView, _super);
    function MainPanelView() {
        _super.apply(this, arguments);
        this.expanded = false;
        this.clearedError = true;
    }
    MainPanelView.content = function () {
        var _this = this;
        var btn = function (view, text, className) {
            if (className === void 0) { className = ''; }
            return _this.button({
                'class': "btn " + className,
                'click': view + "PanelSelected",
                'outlet': view + "PanelBtn",
                'style': 'top:-2px!important'
            }, text);
        };
        this.div({
            class: 'am-panel tool-panel panel-bottom native-key-bindings atomts-main-panel',
            tabindex: '-1'
        }, function () {
            _this.div({
                class: 'panel-resize-handle',
                style: 'position: absolute; top: 0; left: 0; right: 0; height: 10px; cursor: row-resize; z-index: 3'
            });
            _this.div({
                class: 'panel-heading'
            }, function () {
                _this.span({
                    style: 'cursor: pointer; color: rgb(0, 148, 255)',
                    click: 'toggle'
                }, function () {
                    _this.span({
                        class: "icon-microscope"
                    });
                    _this.span({
                        style: 'font-weight:bold'
                    }, " TypeScript ");
                });
                _this.div({
                    class: 'btn-group',
                    style: 'margin-left: 5px'
                }, function () {
                    btn("error", panelHeaders.error, 'selected');
                    btn("build", panelHeaders.build);
                });
                _this.div({
                    class: 'heading-summary',
                    style: 'display:inline-block; margin-left:5px; width: calc(100% - 500px); max-height:12px; overflow: hidden; white-space:nowrap; text-overflow: ellipsis',
                    outlet: 'summary'
                });
                _this.div({
                    class: 'heading-buttons pull-right',
                    style: 'width:15px; display:inline-block'
                }, function () {
                    _this.div({
                        class: 'heading-fold icon-unfold',
                        style: 'cursor: pointer',
                        outlet: 'btnFold',
                        click: 'toggle'
                    });
                });
                _this.progress({
                    class: 'inline-block build-progress',
                    style: 'display: none; color:red',
                    outlet: 'buildProgress'
                });
            });
            _this.div({
                class: 'panel-body atomts-panel-body padded',
                outlet: 'errorBody',
                style: 'overflow-y: auto; display:none'
            });
            _this.div({
                class: 'panel-body atomts-panel-body padded',
                outlet: 'buildBody',
                style: 'overflow-y: auto; display:none'
            });
        });
    };
    MainPanelView.prototype.init = function () {
        this.buildPanelBtn.html(panelHeaders.build + " ( <span class=\"text-success\">No Build</span> )");
        this.buildBody.html('<span class="text-success"> No Build. Press (ctrl+shift+b / cmd+shift+b ) to start a build for an active TypeScript file\'s project. </span>');
    };
    MainPanelView.prototype.errorPanelSelected = function () {
        this.errorPanelBtn.addClass('selected');
        this.buildPanelBtn.removeClass('selected');
        this.expanded = true;
        this.setActivePanel();
        gotoHistory.activeList = gotoHistory.errorsInOpenFiles;
        gotoHistory.activeList.lastPosition = null;
    };
    MainPanelView.prototype.buildPanelSelected = function () {
        this.errorPanelBtn.removeClass('selected');
        this.buildPanelBtn.addClass('selected');
        this.expanded = true;
        this.setActivePanel();
        gotoHistory.activeList = gotoHistory.buildOutput;
        gotoHistory.activeList.lastPosition = null;
    };
    MainPanelView.prototype.setActivePanel = function () {
        if (this.expanded) {
            if (this.errorPanelBtn.hasClass('selected')) {
                this.errorBody.show('fast');
                this.buildBody.hide('fast');
            }
            else {
                this.buildBody.show('fast');
                this.errorBody.hide('fast');
            }
        }
        else {
            this.errorBody.hide('fast');
            this.buildBody.hide('fast');
        }
    };
    MainPanelView.prototype.toggle = function () {
        this.expanded = !this.expanded;
        this.setActivePanel();
    };
    MainPanelView.prototype.clearError = function () {
        this.clearedError = true;
        this.errorBody.empty();
    };
    MainPanelView.prototype.addError = function (view) {
        if (this.clearedError && view.getSummary) {
            this.setErrorSummary(view.getSummary());
        }
        this.clearedError = false;
        this.errorBody.append(view.$);
    };
    MainPanelView.prototype.setErrorSummary = function (summary) {
        var message = summary.summary, className = summary.className, raw = summary.rawSummary || false, handler = summary.handler || undefined;
        this.summary.attr('class', 'heading-summary');
        this.summary.html(message);
        if (className) {
            this.summary.addClass(className);
        }
        if (handler) {
            handler(this.summary);
        }
    };
    MainPanelView.prototype.setErrorPanelErrorCount = function (fileErrorCount, totalErrorCount) {
        var title = panelHeaders.error + " ( <span class=\"text-success\">No Errors</span> )";
        if (totalErrorCount > 0) {
            title = panelHeaders.error + " (\n                <span class=\"text-highlight\" style=\"font-weight: bold\"> " + fileErrorCount + " </span>\n                <span class=\"text-error\" style=\"font-weight: bold;\"> file" + (fileErrorCount === 1 ? "" : "s") + " </span>\n                <span class=\"text-highlight\" style=\"font-weight: bold\"> " + totalErrorCount + " </span>\n                <span class=\"text-error\" style=\"font-weight: bold;\"> error" + (totalErrorCount === 1 ? "" : "s") + " </span>\n            )";
        }
        else {
            this.summary.html('');
            this.errorBody.html('<span class="text-success">No errors in open files \u2665</span>');
        }
        this.errorPanelBtn.html(title);
    };
    MainPanelView.prototype.setBuildPanelCount = function (errorCount, inProgressBuild) {
        if (inProgressBuild === void 0) { inProgressBuild = false; }
        var titleMain = inProgressBuild ? "Build Progress" : panelHeaders.build;
        var title = titleMain + " ( <span class=\"text-success\">No Errors</span> )";
        if (errorCount > 0) {
            title = titleMain + " (\n                <span class=\"text-highlight\" style=\"font-weight: bold\"> " + errorCount + " </span>\n                <span class=\"text-error\" style=\"font-weight: bold;\"> error" + (errorCount === 1 ? "" : "s") + " </span>\n            )";
        }
        else {
            if (!inProgressBuild)
                this.buildBody.html('<span class="text-success">No errors in last build \u2665</span>');
        }
        this.buildPanelBtn.html(title);
    };
    MainPanelView.prototype.clearBuild = function () {
        this.buildBody.empty();
    };
    MainPanelView.prototype.addBuild = function (view) {
        this.buildBody.append(view.$);
    };
    MainPanelView.prototype.setBuildProgress = function (progress) {
        var _this = this;
        if (progress.builtCount == 1) {
            this.buildProgress.show();
            this.buildProgress.removeClass('warn');
            this.buildBody.html('<span class="text-success">Things are looking good \u2665</span>');
            gotoHistory.buildOutput.members = [];
        }
        if (progress.builtCount == progress.totalCount) {
            this.buildProgress.hide();
            return;
        }
        this.buildProgress.prop('value', progress.builtCount);
        this.buildProgress.prop('max', progress.totalCount);
        this.setBuildPanelCount(progress.errorCount, true);
        if (progress.firstError) {
            this.buildProgress.addClass('warn');
            this.clearBuild();
        }
        if (progress.errorsInFile.length) {
            progress.errorsInFile.forEach(function (error) {
                _this.addBuild(new lineMessageView.LineMessageView({
                    goToLine: function (filePath, line, col) {
                        return gotoHistory.gotoLine(filePath, line, col, gotoHistory.buildOutput);
                    },
                    message: error.message,
                    line: error.startPos.line + 1,
                    col: error.startPos.col,
                    file: error.filePath,
                    preview: error.preview
                }));
                gotoHistory.buildOutput.members.push({
                    filePath: error.filePath,
                    line: error.startPos.line + 1,
                    col: error.startPos.col
                });
            });
        }
    };
    return MainPanelView;
})(view.View);
exports.MainPanelView = MainPanelView;
exports.panelView;
var panel;
function attach() {
    if (exports.panelView)
        return;
    exports.panelView = new MainPanelView();
    panel = atom.workspace.addBottomPanel({
        item: exports.panelView,
        priority: 1000,
        visible: true
    });
}
exports.attach = attach;
//# sourceMappingURL=mainPanelView.js.map