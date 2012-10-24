/**
 * PrimeUI inputtext widget
 */
$(function() {

    $.widget("primeui.inputtext", {
       
        _create: function() {
            var input = this.element,
            disabled = input.prop('disabled');

            //visuals
            if(!input.hasClass('ui-inputfield')) {
                input.addClass('ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all');
            }
            
            if(disabled) {
                input.addClass('ui-state-disabled');
            }
            else {
                input.hover(function() {
                    input.toggleClass('ui-state-hover');
                }).focus(function() {
                    input.addClass('ui-state-focus');
                }).blur(function() {
                    input.removeClass('ui-state-focus');
                });
            }

            //aria
            input.attr('role', 'textbox').attr('aria-disabled', disabled)
                                          .attr('aria-readonly', input.prop('readonly'))
                                          .attr('aria-multiline', input.is('textarea'));
        },
        
        _destroy: function() {
            
        }
        
    });
    
});