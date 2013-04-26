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
            $(document.body).on('click.ui-menu', function (e) {
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
 * PrimeUI BaseMenu widget
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