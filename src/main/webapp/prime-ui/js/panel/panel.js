/**
 * PrimeUI Panel Widget
 */
$(function() {

    $.widget("prime-ui.puipanel", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            collapsed: false
        },
        
        _create: function() {
            this.element.addClass('pui-panel ui-widget ui-widget-content ui-corner-all')
                .contents().wrapAll('<div class="pui-panel-content ui-widget-content" />');
                
            var title = this.element.attr('title');
            if(title) {
                this.element.prepend('<div class="pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all">' + title + "</title>")
                        .removeAttr('title');
            }
        }
    });
});