/**
 * PrimeFaces Notify Widget
 */
$(function() {

    $.widget("primeui.puinotify", {
       
        options: {
            position: 'top',
            visible: false,
            effect: 'slide'
        },
        
        _create: function() {
            this.element.addClass('pui-notify pui-notify-' + this.options.position + ' ui-widget ui-widget-content pui-shadow')
                    .wrapInner('<div class="pui-notify-content" />').appendTo(document.body);
            this.content = this.element.children('.pui-notify-content');
            this.closeIcon = $('<span class="ui-icon ui-icon-closethick pui-notify-close"></span>').appendTo(this.element);
            
            this._bindEvents();
            
            if(this.options.visible) {
                this.show();
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.closeIcon.on('click.puinotify', function() {
                $this.hide();
            });
        },
        
        show: function(content) {
            if(content) {
                this.update(content);
            }
            
            if(this.options.effect === 'slide')
                this.element.slideDown();
            else if(this.options.effect === 'fade')
                this.element.fadeIn();
            else if(this.options.effect === 'none')
                this.element.show();
        },

        hide: function() {
            if(this.options.effect === 'slide')
                this.element.slideUp();
            else if(this.options.effect === 'fade')
                this.element.fadeOut();
            else if(this.options.effect === 'none')
                this.element.hide();
        },
        
        update: function(content) {
            this.content.html(content);
        }
    });
});

/**
 * PrimeFaces NotificationBar Widget

PrimeFaces.widget.NotificationBar = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        var _self = this;
	
        //relocate
        this.jq.css(this.cfg.position, '0').appendTo($('body'));

        //display initially
        if(this.cfg.autoDisplay) {
            $(this.jq).css('display','block')
        }

        //bind events
        this.jq.children('.ui-notificationbar-close').click(function() {
            _self.hide();
        });
    },
    
    show: function() {
        if(this.cfg.effect === 'slide')
            $(this.jq).slideDown(this.cfg.effect);
        else if(this.cfg.effect === 'fade')
            $(this.jq).fadeIn(this.cfg.effect);
        else if(this.cfg.effect === 'none')
            $(this.jq).show();
    },
    
    hide: function() {
        if(this.cfg.effect === 'slide')
            $(this.jq).slideUp(this.cfg.effect);
        else if(this.cfg.effect === 'fade')
            $(this.jq).fadeOut(this.cfg.effect);
        else if(this.cfg.effect === 'none')
            $(this.jq).hide();
    },
    
    isVisible: function() {
        return this.jq.is(':visible');
    },

    toggle: function() {
        if(this.isVisible())
            this.hide();
        else
            this.show();
    }
    
});*/