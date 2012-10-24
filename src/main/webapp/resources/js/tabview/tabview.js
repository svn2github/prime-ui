/**
 * PrimeUI TabView widget
 */
$(function() {

    $.widget("primeui.tabview", {
       
        options: {
             activeIndex:0
            ,orientation:'top'
        },
        
        _create: function() {
            var element = this.element;
            
            element.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all ui-hidden-container')
                .children('ul').addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all')
                .children('li').addClass('ui-state-default ui-corner-top');
                
            element.addClass('ui-tabs-' + this.options.orientation);

            element.children('div').addClass('ui-tabs-panels').children().addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');

            element.find('> ul.ui-tabs-nav > li').eq(this.options.activeIndex).addClass('ui-tabs-selected ui-state-active');
            element.find('> div.ui-tabs-panels > div.ui-tabs-panel:not(:eq(' + this.options.activeIndex + '))').addClass('ui-helper-hidden');
            
            this.navContainer = element.children('.ui-tabs-nav');
            this.panelContainer = element.children('.ui-tabs-panels');

            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            //Tab header events
            this.navContainer.children('li')
                    .bind('mouseover.tabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .bind('mouseout.tabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .bind('click.tabview', function(e) {
                        var element = $(this);

                        if($(e.target).is(':not(.ui-icon-close)')) {
                            var index = element.index();

                            if(!element.hasClass('ui-state-disabled') && index != $this.options.selected) {
                                $this.select(index);
                            }
                        }

                        e.preventDefault();
                    });

            //Closable tabs
            this.navContainer.find('li .ui-icon-close')
                .bind('click.tabview', function(e) {
                    var index = $(this).parent().index();

                    $this.remove(index);

                    e.preventDefault();
                });
        },
        
        select: function(index) {
           this.options.selected = index;

           var newPanel = this.panelContainer.children().eq(index),
           headers = this.navContainer.children(),
           oldHeader = headers.filter('.ui-state-active'),
           newHeader = headers.eq(newPanel.index()),
           oldPanel = this.panelContainer.children('.ui-tabs-panel:visible'),
           $this = this;

           //aria
           oldPanel.attr('aria-hidden', true);
           oldHeader.attr('aria-expanded', false);
           newPanel.attr('aria-hidden', false);
           newHeader.attr('aria-expanded', true);

           if(this.options.effect) {
                oldPanel.hide(this.options.effect.name, null, this.options.effect.duration, function() {
                   oldHeader.removeClass('ui-state-focus ui-tabs-selected ui-state-active');

                   newHeader.addClass('ui-state-focus ui-tabs-selected ui-state-active');
                   newPanel.show($this.options.name, null, $this.options.effect.duration, function() {
                       $this._trigger('change', null, index);
                   });
               });
           }
           else {
               oldHeader.removeClass('ui-state-focus ui-tabs-selected ui-state-active');
               oldPanel.hide();

               newHeader.addClass('ui-state-focus ui-tabs-selected ui-state-active');
               newPanel.show();

               this._trigger('change', null, index);
           }
       },

       remove: function(index) {    
           var header = this.navContainer.children().eq(index),
           panel = this.panelContainer.children().eq(index);

           this._trigger('close', null, index);

           header.remove();
           panel.remove();

           //active next tab if active tab is removed
           if(index == this.options.selected) {
               var newIndex = this.options.selected == this.getLength() ? this.options.selected - 1: this.options.selected;
               this.select(newIndex);
           }
       },

       getLength: function() {
           return this.navContainer.children().length;
       },

       getActiveIndex: function() {
           return this.options.selected;
       },

       _markAsLoaded: function(panel) {
           panel.data('loaded', true);
       },

       _isLoaded: function(panel) {
           return panel.data('loaded') == true;
       },

       disable: function(index) {
           this.navContainer.children().eq(index).addClass('ui-state-disabled');
       },

       enable: function(index) {
           this.navContainer.children().eq(index).removeClass('ui-state-disabled');
       }

    });
});