/**
 * jQuery Plugin for InputText Widget
 */
(function($) {
  
  $.fn.inputtext = function() {
      
      return this.each(function() {
            var input = $(this);
            
            //visuals
            if(!input.hasClass('ui-inputfield')) {
                input.addClass('ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all');
            }

            //events
            input.hover(function() {
                $(this).toggleClass('ui-state-hover');
            }).focus(function() {
                $(this).addClass('ui-state-focus');
            }).blur(function() {
                $(this).removeClass('ui-state-focus');
            });

            //aria
            input.attr('role', 'textbox').attr('aria-disabled', input.is(':disabled'))
                                          .attr('aria-readonly', input.prop('readonly'))
                                          .attr('aria-multiline', input.is('textarea'));
      });
  };
  
})(jQuery);