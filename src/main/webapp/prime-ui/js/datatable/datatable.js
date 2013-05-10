/**
 * PrimeUI Datatable Widget
 */
$(function() {

    $.widget("primeui.puidatatable", {
       
        options: {
            columns: null,
            data: null
        },
        
        _create: function() {
            this.element.addClass('pui-datatable ui-widget');
            this.tableWrapper = $('<div class="pui-datatable-tablewrapper" />').appendTo(this.element);
            this.table = $('<table><thead></thead><tbody></tbody></table>').appendTo(this.tableWrapper);
            this.thead = this.table.children('thead');
            this.tbody = this.table.children('tbody');
            
            var $this = this;
            
            if(this.options.columns) {
                $.each(this.options.columns, function(i, col) {
                    var header = $('<th class="ui-state-default"></th>').appendTo($this.thead);
                    if(col.headerText) {
                        header.text(col.headerText);
                    }
                });
            }
            
            if(this.options.data) {
                for(var i = 0; i < this.options.data.length; i++) {
                    var rowData = this.options.data[i],
                    row = $('<tr class="ui-widget-content" />').appendTo(this.tbody),
                    zebraStyle = (i%2 === 0) ? 'pui-datatable-even' : 'pui-datatable-odd';
                    
                    row.addClass(zebraStyle);
                    
                    for(var j = 0; j < rowData.length; j++) {
                        var column = $('<td />').appendTo(row),
                        value = rowData[j];
                        
                        if(value !== undefined) {
                            column.text(value);
                        }
                    }
                }
            }
        }
    });
});