/**
 * PrimeFaces InputText Widget
 */
PrimeFaces.widget.InputText = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.jq, this.cfg.behaviors);
        }

        //Visuals
        PrimeFaces.enhanceInput(this.jq);
    }
});

/**
 * jQuery Plugin for InputText Widget
 */
(function( $ ) {
  
  $.fn.inputtext = function() {
      
      return this.each(function() {
         PrimeFaces.enhanceInput($(this));
      });
  };
  
})(jQuery);