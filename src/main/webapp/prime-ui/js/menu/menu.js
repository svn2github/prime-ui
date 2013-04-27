/**
 * PrimeUI BaseMenu widget
 */
$(function() {

    $.widget("primeui.puibasemenu", {
       
        options: {
             popup: false,
             trigger: null,
             my: 'left top',
             at: 'left bottom',
             triggerEvent: 'click'
        },
        
        _create: function() {
            if(this.options.popup) {
                this._initPopup();
            }
        },
                
        _initPopup: function() {
            var $this = this;

            this.element.parent().addClass('pui-menu-dynamic pui-shadow').appendTo(document.body);

            this.positionConfig = {
                my: this.options.my
                ,at: this.options.at
                ,of: this.options.trigger
            }

            this.options.trigger.on(this.options.triggerEvent + '.pui-menu', function(e) {
                var trigger = $(this);

                if($this.element.is(':visible')) {
                    $this.hide();
                }
                else {
                    $this.show();
                }
                
                e.preventDefault();
            });

            //hide overlay on document click
            $(document.body).on('click.pui-menu', function (e) {
                var popup = $this.element.parent();
                if(popup.is(":hidden")) {
                    return;
                }

                //do nothing if mousedown is on trigger
                var target = $(e.target);
                if(target.is($this.options.trigger.get(0))||$this.options.trigger.has(target).length > 0) {
                    return;
                }

                //hide if mouse is outside of overlay except trigger
                var offset = popup.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + popup.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + popup.height()) {

                    $this.hide(e);
                }
            });

            //Hide overlay on resize
            $(window).on('resize.pui-menu', function() {
                if($this.element.parent().is(':visible')) {
                    $this.align();
                }
            });
        },
                
        show: function() {
            this.align();
            this.element.parent().css('z-index', ++PUI.zindex).show();
        },

        hide: function() {
            this.element.parent().fadeOut('fast');
        },

        align: function() {
            this.element.parent().css({left:'', top:''}).position(this.positionConfig);
        }
    });
});

/**
 * PrimeUI Menu widget
 */
$(function() {

    $.widget("primeui.puimenu", $.primeui.puibasemenu, {
       
        options: {
             
        },
        
        _create: function() {
            this.element.addClass('pui-menu-list ui-helper-reset').
                    wrap('<div class="pui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix" />');
            
            this.element.children('li').each(function() {
                var listItem = $(this);
                
                if(listItem.children('h3').length > 0) {
                    listItem.addClass('ui-widget-header ui-corner-all');
                }
                else {
                    listItem.addClass('pui-menuitem ui-widget ui-corner-all');
                    var menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');
                    
                    menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');
                    
                    if(icon) {
                        menuitemLink.prepend('<span class="pui-menuitem-icon ui-icon ' + icon + '"></span>');
                    }
                }
            });
            
            this.menuitemLinks = this.element.find('.pui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();
            
            this._super();
        },
            
        _bindEvents: function() {  
            var $this = this;

            this.menuitemLinks.on('mouseenter.pui-menu', function(e) {
                $(this).addClass('ui-state-hover');
            })
            .on('mouseleave.pui-menu', function(e) {
                $(this).removeClass('ui-state-hover');
            });

            if(this.options.popup) {
                this.menuitemLinks.on('click.pui-menu', function() {
                    $this.hide();
                });  
            }   
        }
    });
});

/*
 * PrimeUI TieredMenu Widget
 */
$(function() {

    $.widget("primeui.puitieredmenu", $.primeui.puibasemenu, {
        
        options: {
            autoDisplay: true    
        },
        
        _create: function() {
            this._render();
            
            this.links = this.element.find('.pui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();
            
            this._super();
        },
                
        _render: function() {
            this.element.addClass('pui-menu-list ui-helper-reset').
                    wrap('<div class="pui-tieredmenu pui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix" />');
            
            this.element.parent().uniqueId();
            this.options.id = this.element.parent().attr('id');
          
            this.element.find('li').each(function() {
                    var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');
                    
                    menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');
                    
                    if(icon) {
                        menuitemLink.prepend('<span class="pui-menuitem-icon ui-icon ' + icon + '"></span>');
                    }
                    
                    listItem.addClass('pui-menuitem ui-widget ui-corner-all');
                    if(listItem.children('ul').length > 0) {
                        listItem.addClass('pui-menu-parent');
                        listItem.children('ul').addClass('ui-widget-content pui-menu-list ui-corner-all ui-helper-clearfix pui-menu-child ui-shadow');
                        menuitemLink.prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>');
                    }
                
            
            });
        },
                
        _bindEvents: function() {        
            this._bindItemEvents();
        
            this._bindDocumentHandler();
        },
    
        _bindItemEvents: function() {
            var $this = this;

            this.links.on('mouseenter.pui-menu',function() {
                var link = $(this),
                menuitem = link.parent(),
                autoDisplay = $this.options.autoDisplay;

                var activeSibling = menuitem.siblings('.pui-menuitem-active');
                if(activeSibling.length === 1) {
                    $this._deactivate(activeSibling);
                }

                if(autoDisplay||$this.active) {
                    if(menuitem.hasClass('pui-menuitem-active')) {
                        $this._reactivate(menuitem);
                    }
                    else {
                        $this._activate(menuitem);
                    }  
                }
                else {
                    $this._highlight(menuitem);
                }
            });

            if(this.options.autoDisplay === false) {
                this.rootLinks = this.element.find('> .pui-menuitem > .pui-menuitem-link');
                this.rootLinks.data('primeui-tieredmenu-rootlink', this.options.id).find('*').data('primeui-tieredmenu-rootlink', this.options.id)

                this.rootLinks.on('click.pui-menu', function(e) {
                    var link = $(this),
                    menuitem = link.parent(),
                    submenu = menuitem.children('ul.pui-menu-child');

                    if(submenu.length === 1) {
                        if(submenu.is(':visible')) {
                            $this.active = false;
                            $this._deactivate(menuitem);
                        }
                        else {                                        
                            $this.active = true;
                            $this._highlight(menuitem);
                            $this._showSubmenu(menuitem, submenu);
                        }
                    }
                });
            }
            
            this.element.find('ul.pui-menu-list').on('mouseleave.pui-menu', function(e) {
                if($this.activeitem) {
                    $this._deactivate($this.activeitem);
                }
           
                e.stopPropagation();
            });
        },
       
        _bindDocumentHandler: function() {
            var $this = this;

            $(document.body).on('click.pui-menu', function(e) {
                var target = $(e.target);
                if(target.data('primeui-tieredmenu-rootlink') === $this.options.id) {
                    return;
                }
                    
                $this.active = false;

                $this.element.find('li.pui-menuitem-active').each(function() {
                    $this._deactivate($(this), true);
                });
            });
        },
    
        _deactivate: function(menuitem, animate) {
            this.activeitem = null;
            menuitem.children('a.pui-menuitem-link').removeClass('ui-state-hover');
            menuitem.removeClass('pui-menuitem-active');

            if(animate)
                menuitem.children('ul.pui-menu-child:visible').fadeOut('fast');
            else
                menuitem.children('ul.pui-menu-child:visible').hide();
        },

        _activate: function(menuitem) {
            this._highlight(menuitem);

            var submenu = menuitem.children('ul.pui-menu-child');
            if(submenu.length === 1) {
                this._showSubmenu(menuitem, submenu);
            }
        },

        _reactivate: function(menuitem) {
            this.activeitem = menuitem;
            var submenu = menuitem.children('ul.pui-menu-child'),
            activeChilditem = submenu.children('li.pui-menuitem-active:first'),
            _self = this;

            if(activeChilditem.length === 1) {
                _self._deactivate(activeChilditem);
            }
        },

        _highlight: function(menuitem) {
            this.activeitem = menuitem;
            menuitem.children('a.pui-menuitem-link').addClass('ui-state-hover');
            menuitem.addClass('pui-menuitem-active');
        },
                
        _showSubmenu: function(menuitem, submenu) {
            submenu.css({
                'left': menuitem.outerWidth()
                ,'top': 0
                ,'z-index': ++PUI.zindex
            });

            submenu.show();
        }
            
    });

});

/**
 * PrimeFaces Menubar Widget
 */

$(function() {

    $.widget("primeui.puimenubar", $.primeui.puitieredmenu, {
        
        options: {
            autoDisplay: true    
        },
        
        _create: function() {
            this._super();
            this.element.parent().removeClass('pui-tieredmenu').
                    addClass('pui-menubar');
        },
              
        _showSubmenu: function(menuitem, submenu) {
            submenu.css('z-index', ++PUI.zindex);

            if(menuitem.parent().hasClass('pui-menu-child')) {    //submenu menuitem
                var win = $(window),
                offset = menuitem.offset(),
                menuitemTop = offset.top,
                submenuHeight = submenu.outerHeight(),
                menuitemHeight = menuitem.outerHeight(),
                top = (menuitemTop + submenuHeight) > (win.height() + win.scrollTop()) ? (-1 * submenuHeight) + menuitemHeight : 0;  //viewport check

                submenu.css({
                    'left': menuitem.outerWidth(),
                    'top': top,
                    'z-index': ++PUI.zindex
                }).show();
            } 
            else {  
                submenu.css({                                    //root menuitem         
                    'left': 0
                    ,'top': menuitem.outerHeight()
                });

            }

            submenu.show();
    }        
    });

});