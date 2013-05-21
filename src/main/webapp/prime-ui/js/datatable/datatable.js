/**
 * PrimeUI Datatable Widget
 */
$(function() {

    $.widget("primeui.puidatatable", {
       
        options: {
            columns: null,
            data: null,
            sortable: false,
            paginator: null
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
                    var header = $('<th class="ui-state-default"></th>').data('field',col.field).appendTo($this.thead);
                                        
                    if(col.headerText) {
                        header.text(col.headerText);
                    }
                    
                    if(col.sortable) {
                        header.addClass('pui-sortable-column')
                                .data('order', 1)
                                .append('<span class="pui-sortable-column-icon ui-icon ui-icon-carat-2-n-s"></span>');
                    }
                });
            }
            
            this._renderData();
            
            if(this.options.paginator) {
                var paginatorContainer = $('<div></div>').insertAfter(this.tableWrapper);
                paginatorContainer.puipaginator(this.options.paginator);
            }
            
            if(this.options.sortable) {
                this._initSorting();
            }
        },
                
        _initSorting: function() {
            var $this = this,
            sortableColumns = this.thead.children('th.pui-sortable-column');
            
            sortableColumns.on('mouseover.datatable', function() {
                var column = $(this);

                if(!column.hasClass('ui-state-active'))
                    column.addClass('ui-state-hover');
            })
            .on('mouseout.datatable', function() {
                var column = $(this);

                if(!column.hasClass('ui-state-active'))
                    column.removeClass('ui-state-hover');
            })
            .on('click.datatable', function() {
                var column = $(this),
                field = column.data('field'),
                order = column.data('order'),
                sortIcon = column.children('.pui-sortable-column-icon');
                
                //clean previous sort state
                column.siblings().filter('.ui-state-active').removeClass('ui-state-active').children('span.pui-sortable-column-icon')
                                                            .removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
                
                $this.sort(field, order);
                
                //update state
                column.data('order', -1*order);
                
                column.removeClass('ui-state-hover').addClass('ui-state-active');
                if(order === -1)
                    sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                else if(order === 1)
                    sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
            });
        },
                
        sort: function(field, order) {
            this.options.data.sort(function(data1, data2) {
                var value1 = data1[field],
                value2 = data2[field],
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                return (order * result);
            });
            
            this._renderData();
        },
                
        sortByField: function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase(); 
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        },
                
        _renderData: function() {
            if(this.options.data) {
                this.tbody.html('');
                
                for(var i = 0; i < this.options.data.length; i++) {
                    var rowData = this.options.data[i],
                    row = $('<tr class="ui-widget-content" />').appendTo(this.tbody),
                    zebraStyle = (i%2 === 0) ? 'pui-datatable-even' : 'pui-datatable-odd';
                    
                    row.addClass(zebraStyle);
                    
                    for(var field in rowData) {
                        var column = $('<td />').appendTo(row),
                        fieldValue = rowData[field];
                
                        column.text(fieldValue);
                    }
                }
            }
        }
    });
});