/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
  
})();

/**
 * PUI Object 
 */
PUI = {
  
  widget: {}
  
  ,escapeClientId : function(id) {
        return "#" + id.replace(/:/g,"\\:");
  }
  
  ,enhanceInput : function(input) {
        //visuals
        if(!input.hasClass('ui-inputfield')) {
            input.addClass('ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all');
        }
        
        //events
        input.hover(
            function() {
                $(this).addClass('ui-state-hover');
            },
            function() {
                $(this).removeClass('ui-state-hover');
            }
        ).focus(function() {
                $(this).addClass('ui-state-focus');
        }).blur(function() {
                $(this).removeClass('ui-state-focus');
        });
        
        //aria
        input.attr('role', 'textbox').attr('aria-disabled', input.is(':disabled'))
                                      .attr('aria-readonly', input.prop('readonly'))
                                      .attr('aria-multiline', input.is('textarea'));
        
        
        return this;
    },
    
    /**
     *  Aligns container scrollbar to keep item in container viewport, algorithm copied from jquery-ui menu widget
     */
    scrollInView: function(container, item) {        
        var borderTop = parseFloat(container.css('borderTopWidth')) || 0,
        paddingTop = parseFloat(container.css('paddingTop')) || 0,
        offset = item.offset().top - container.offset().top - borderTop - paddingTop,
        scroll = container.scrollTop(),
        elementHeight = container.height(),
        itemHeight = item.outerHeight(true);

        if(offset < 0) {
            container.scrollTop(scroll + offset);
        }
        else if((offset + itemHeight) > elementHeight) {
            container.scrollTop(scroll + offset - elementHeight + itemHeight);
        }
    }
};

/**
 * BaseWidget for PrimeFaces Widgets
 */
PrimeFaces.widget.BaseWidget = Class.extend({
    
  init: function(cfg) {
    this.cfg = cfg;
    this.id = cfg.id;
    this.jqId = PrimeFaces.escapeClientId(this.id),
    this.jq = $(this.jqId);
    
    //remove script tag
    $(this.jqId + '_s').remove();
  },
  
  //used mostly in ajax updates, reloads the widget configuration
  refresh: function(cfg) {
    return this.init(cfg);
  },
  
  //returns jquery object representing the main dom element related to the widget
  getJQ: function(){
    return this.jq;
  }
  
});