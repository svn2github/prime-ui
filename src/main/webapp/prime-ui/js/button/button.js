/**
 * PrimeFaces Growl Widget
 */
$(function() {

    $.widget("prime-ui.puibutton", {
       
        options: {
            icon: null
            ,iconPos : 'left'
        },
        
        _create: function() {
            var element = this.element,
            text = element.text()||'pui-button',
            disabled = element.prop('disabled'),
            styleClass = null;
            
            if(this.options.icon) {
                styleClass = (text === 'pui-button') ? 'pui-button-icon-only' : 'pui-button-text-icon-' + this.options.iconPos;
            }
            else {
                styleClass = 'pui-button-text-only';
            }
        
            if(disabled) {
                styleClass += ' ui-state-disabled';
            }
            
            this.element.addClass('pui-button ui-widget ui-state-default ui-corner-all ' + styleClass).text('');
            
            if(this.options.icon) {
                this.element.append('<span class="pui-button-icon-' + this.options.iconPos + ' ui-icon ' + this.options.icon + '" />');
            }
            
            this.element.append('<span class="pui-button-text">' + text + '</span>');
            
            //aria
            element.attr('role', 'button').attr('aria-disabled', disabled);    
            
            if(!disabled) {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var element = this.element;
            
            element.mouseover(function(){
                if(!element.prop('disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).mouseout(function() {
                $(this).removeClass('ui-state-active ui-state-hover');
            }).mousedown(function() {
                if(!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-active').removeClass('ui-state-hover');
                }
            }).mouseup(function() {
                $(this).removeClass('ui-state-active').addClass('ui-state-hover');
            }).focus(function() {
                $(this).addClass('ui-state-focus');
            }).blur(function() {
                $(this).removeClass('ui-state-focus');
            }).keydown(function(e) {
                if(e.keyCode == $.ui.keyCode.SPACE || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.NUMPAD_ENTER) {
                    $(this).addClass('ui-state-active');
                }
            }).keyup(function() {
                $(this).removeClass('ui-state-active');
            });

            return this;
        }
    });
});