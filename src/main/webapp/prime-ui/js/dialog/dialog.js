/**
 * PrimeUI Dialog Widget
 */
$(function() {

    $.widget("prime-ui.puidialog", {
       
        options: {
            draggable: true,
            resizable: true,
            location: 'center',
            minWidth: 150,
            minHeight: 20,
            height: 'auto',
            width: 'auto',
            visible: false,
            modal: false,
            showEffect: null,
            hideEffect: null,
            effectOptions: {},
            effectSpeed: 'normal',
            closeOnEscape: true,
            rtl: false,
            closable: true,
            minimizable: false,
            maximizable: false,
            appendTo: null
        },
        
        _create: function() {
            //render
            this.element.addClass('pui-dialog ui-widget ui-widget-content ui-helper-hidden ui-corner-all pui-shadow')
                        .contents().wrapAll('<div class="pui-dialog-content ui-widget-content" />');
                                        
            this.element.prepend('<div class="pui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">'
                                + '<span id="' + this.element.attr('id') + '_label" class="pui-dialog-title">' + this.element.attr('title') + '</span>');
            
            if(this.options.rtl) {
                this.element.addClass('pui-dialog-rtl');
            }
            
            //elements
            this.content = this.element.children('.pui-dialog-content');
            this.titlebar = this.element.children('.pui-dialog-titlebar');
            
            if(this.options.closable) {
                this._renderHeaderIcon('pui-dialog-titlebar-close', 'ui-icon-closethick');
            }
            
            if(this.options.minimizable) {
                this._renderHeaderIcon('pui-dialog-titlebar-minimize', 'ui-icon-minus');
            }
            
            if(this.options.minimizable) {
                this._renderHeaderIcon('pui-dialog-titlebar-maximize', 'ui-icon-extlink');
            }
            
            //icons
            this.icons = this.titlebar.children('.pui-dialog-titlebar-icon');
            this.closeIcon = this.titlebar.children('.pui-dialog-titlebar-close');
            this.minimizeIcon = this.titlebar.children('.pui-dialog-titlebar-minimize');
            this.maximizeIcon = this.titlebar.children('.pui-dialog-titlebar-maximize');
            this.blockEvents = 'focus.puidialog mousedown.puidialog mouseup.puidialog keydown.puidialog keyup.puidialog';
            
            if(this.options.width === 'auto' && PUI.isIE(7)) {
                this.options.width = '300px';
            }
            
            //size
            this.element.css({'width': this.options.width, 'height': 'auto'});
            this.content.height(this.options.height);

            //events
            this._bindEvents();

            if(this.options.draggable) {
                this._setupDraggable();
            }

            if(this.options.resizable){
                this._setupResizable();
            }

            if(this.options.appendTo){
                this.element.appendTo(this.options.appendTo);
            }

            //docking zone
            if($(document.body).children('.pui-dialog-docking-zone').length == 0) {
                $(document.body).append('<div class="pui-dialog-docking-zone"></div>')
            }

            //aria
            this._applyARIA();

            if(this.options.visible){
                this.show();
            }
        },
        
        _renderHeaderIcon: function(styleClass, icon) {
            this.titlebar.append('<a class="pui-dialog-titlebar-icon ' + styleClass + ' ui-corner-all" href="#" role="button">'
                                + '<span class="ui-icon ' + icon + '"></span></a>');
        },
        
        _enableModality: function() {
            var $this = this,
            doc = $(document);

            this.modality = $('<div id="' + this.element.attr('id') + '_modal" class="ui-widget-overlay"></div>').appendTo(document.body)
                                .css({
                                    'width' : doc.width(),
                                    'height' : doc.height(),
                                    'z-index' : this.element.css('z-index') - 1
                                });

            //Disable tabbing out of modal dialog and stop events from targets outside of dialog
            doc.bind('keydown.puidialog',
                    function(event) {
                        if(event.keyCode == $.ui.keyCode.TAB) {
                            var tabbables = $this.content.find(':tabbable'), 
                            first = tabbables.filter(':first'), 
                            last = tabbables.filter(':last');

                            if(event.target === last[0] && !event.shiftKey) {
                                first.focus(1);
                                return false;
                            } 
                            else if (event.target === first[0] && event.shiftKey) {
                                last.focus(1);
                                return false;
                            }
                        }
                    })
                    .bind(this.blockEvents, function(event) {
                        if ($(event.target).zIndex() < $this.element.zIndex()) {
                            return false;
                        }
                    });
        },

        _disableModality: function(){
            this.modality.remove();
            this.modality = null;
            $(document).unbind(this.blockEvents).unbind('keydown.dialog');
        },

        show: function() {
            if(this.element.is(':visible')) {
                return;
            }

            if(!this.positionInitialized) {
                this._initPosition();
            }
            
            this._trigger('beforeShow', null);

            if(this.options.showEffect) {
                var $this = this;

                this.element.show(this.options.showEffect, this.options.effectOptions, this.options.effectSpeed, function() {
                    $this._postShow();
                });
            }    
            else {
                this.element.show();

                this._postShow();
            }

            this._moveToTop();

            if(this.options.modal) {
                this._enableModality();
            }
        },

        _postShow: function() {   
            //execute user defined callback
            this._trigger('afterShow', null);

            this.element.attr({
                'aria-hidden': false
                ,'aria-live': 'polite'
            });

            this._applyFocus();
        },

        hide: function() {   
            if(this.element.is(':hidden')) {
                return;
            }
            
            this._trigger('beforeHide', null);

            if(this.options.hideEffect) {
                var _self = this;

                this.element.hide(this.options.hideEffect, this.options.effectOptions, this.options.effectSpeed, function() {
                    _self._postHide();
                });
            }
            else {
                this.element.hide();

                this._postHide();
            }

            if(this.options.modal) {
                this._disableModality();
            }
        },
        
        _postHide: function() {
            //execute user defined callback
            this._trigger('afterHide', null);

            this.element.attr({
                'aria-hidden': true
                ,'aria-live': 'off'
            });
        },

        _applyFocus: function() {
            this.element.find(':not(:submit):not(:button):input:visible:enabled:first').focus();
        },

        _bindEvents: function() {   
            var $this = this;

            this.icons.hover(function() {
                $(this).toggleClass('ui-state-hover');
            });

            this.closeIcon.on('click.puidialog', function(e) {
                $this.hide();
                e.preventDefault();
            });

            /*this.maximizeIcon.click(function(e) {
                $this.toggleMaximize();
                e.preventDefault();
            });

            this.minimizeIcon.click(function(e) {
                $this.toggleMinimize();
                e.preventDefault();
            });*/

            if(this.options.closeOnEscape) {
                $(document).on('keydown.dialog_' + this.element.attr('id'), function(e) {
                    var keyCode = $.ui.keyCode,
                    active = parseInt($this.element.css('z-index')) === PUI.zindex;

                    if(e.which === keyCode.ESCAPE && $this.is(':visible') && active) {
                        $this.hide();
                    };
                });
            }
            
            if(this.options.modal) {
                $(window).on('resize.puidialog', function() {
                    $(document.body).children('.ui-widget-overlay').css({
                        'width': $(document).width()
                        ,'height': $(document).height()
                    });
                });
            }
        },

        _setupDraggable: function() {    
            this.element.draggable({
                cancel: '.pui-dialog-content, .pui-dialog-titlebar-close',
                handle: '.pui-dialog-titlebar',
                containment : 'document'
            });
        },

        _setupResizable: function() {
            this.element.resizable({
                minWidth : this.options.minWidth,
                minHeight : this.options.minHeight,
                alsoResize : this.content,
                containment: 'document'
            });

            this.resizers = this.element.children('.ui-resizable-handle');
        },

        _initPosition: function() {
            //reset
            this.element.css({left:0,top:0});

            if(/(center|left|top|right|bottom)/.test(this.options.location)) {
                this.options.location = this.options.location.replace(',', ' ');

                this.element.position({
                            my: 'center'
                            ,at: this.options.location
                            ,collision: 'fit'
                            ,of: window
                            //make sure dialog stays in viewport
                            ,using: function(pos) {
                                var l = pos.left < 0 ? 0 : pos.left,
                                t = pos.top < 0 ? 0 : pos.top;

                                $(this).css({
                                    left: l
                                    ,top: t
                                });
                            }
                        });
            }
            else {
                var coords = this.options.position.split(','),
                x = $.trim(coords[0]),
                y = $.trim(coords[1]);

                this.element.offset({
                    left: x
                    ,top: y
                });
            }

            this.positionInitialized = true;
        },

        _moveToTop: function() {
            this.element.css('z-index',++PUI.zindex);
        },

        toggleMaximize: function() {
            if(this.minimized) {
                this.toggleMinimize();
            }

            if(this.maximized) {
                this.jq.removeClass('ui-dialog-maximized');
                this.restoreState();

                this.maximizeIcon.children('.ui-icon').removeClass('ui-icon-newwin').addClass('ui-icon-extlink');
                this.maximized = false;
            } 
            else {
                this.saveState();

                var win = $(window);

                this.jq.addClass('ui-dialog-maximized').css({
                    'width': win.width() - 6
                    ,'height': win.height()
                }).offset({
                    top: win.scrollTop()
                    ,left: win.scrollLeft()
                });

                //maximize content
                this.content.css({
                    width: 'auto',
                    height: 'auto'
                });

                this.maximizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-extlink').addClass('ui-icon-newwin');
                this.maximized = true;

                if(this.cfg.behaviors) {
                    var maximizeBehavior = this.cfg.behaviors['maximize'];

                    if(maximizeBehavior) {
                        maximizeBehavior.call(this);
                    }
                }
            }
        },

        toggleMinimize: function() {
            var animate = true,
            dockingZone = $(document.body).children('.ui-dialog-docking-zone');

            if(this.maximized) {
                this.toggleMaximize();
                animate = false;
            }

            var _self = this;

            if(this.minimized) {
                this.jq.appendTo(this.parent).removeClass('ui-dialog-minimized').css({'position':'fixed', 'float':'none'});
                this.restoreState();
                this.content.show();
                this.minimizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                this.minimized = false;

                if(this.cfg.resizable)
                    this.resizers.show();
            }
            else {
                this.saveState();

                if(animate) {
                    this.jq.effect('transfer', {
                                    to: dockingZone
                                    ,className: 'ui-dialog-minimizing'
                                    }, 500, 
                                    function() {
                                        _self.dock(dockingZone);
                                        _self.jq.addClass('ui-dialog-minimized');
                                    });
                } 
                else {
                    this.dock(dockingZone);
                }
            }
        },

        dock: function(zone) {
            this.jq.appendTo(zone).css('position', 'static');
            this.jq.css({'height':'auto', 'width':'auto', 'float': 'left'});
            this.content.hide();
            this.minimizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
            this.minimized = true;

            if(this.cfg.resizable) {
                this.resizers.hide();
            }

            if(this.cfg.behaviors) {
                var minimizeBehavior = this.cfg.behaviors['minimize'];

                if(minimizeBehavior) {
                    minimizeBehavior.call(this);
                }
            }
        },

        saveState: function() {
            this.state = {
                width: this.jq.width()
                ,height: this.jq.height()
            };

            var win = $(window);
            this.state.offset = this.jq.offset();
            this.state.windowScrollLeft = win.scrollLeft();
            this.state.windowScrollTop = win.scrollTop();
        },

        restoreState: function(includeOffset) {
            this.jq.width(this.state.width).height(this.state.height);

            var win = $(window);
            this.jq.offset({
            top: this.state.offset.top + (win.scrollTop() - this.state.windowScrollTop)
            ,left: this.state.offset.left + (win.scrollLeft() - this.state.windowScrollLeft)
            });
        },

        loadContents: function() {
            var options = {
                source: this.id,
                process: this.id,
                update: this.id
            },
            _self = this;

            options.onsuccess = function(responseXML) {
                var xmlDoc = $(responseXML.documentElement),
                updates = xmlDoc.find("update");

                for(var i=0; i < updates.length; i++) {
                    var update = updates.eq(i),
                    id = update.attr('id'),
                    content = update.text();

                    if(id == _self.id){
                        _self.content.html(content);
                        _self.loaded = true;
                    }
                    else {
                        PrimeFaces.ajax.AjaxUtils.updateElement.call(this, id, content);
                    }
                }

                PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, xmlDoc);

                return true;
            };

            options.oncomplete = function() {
                _self.show();
            };

            options.params = [
                {name: this.id + '_contentLoad', value: true}
            ];

            PrimeFaces.ajax.AjaxRequest(options);
        },
        
        _applyARIA: function() {
            this.element.attr({
                'role': 'dialog'
                ,'aria-labelledby': this.element.attr('id') + '_title'
                ,'aria-hidden': !this.options.visible
            });

            this.titlebar.children('a.pui-dialog-titlebar-icon').attr('role', 'button');
        }
    });
});