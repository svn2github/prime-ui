/**
 * PrimeUI Paginator Widget
 */
$(function() {
    
    ElementHandlers = {
        
        '{FirstPageLink}': {
            markup: '<span class="pui-paginator-first pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-first">p</span></span>',
            
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === 0) {
                    element.addClass('ui-state-disabled');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', 0);
                    }
                });
                                
                return element;
            },
            
            update: function(element, state) {
                if(state.page === 0)
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{PreviousPageLink}': {
            markup: '<span class="pui-paginator-prev pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-prev">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === 0) {
                    element.addClass('ui-state-disabled');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page - 1);
                    }
                });
                
                return element;
            },
                    
            update: function(element, state) {
                if(state.page === 0)
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{NextPageLink}': {
            markup: '<span class="pui-paginator-next pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-next">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page + 1);
                    }
                });
                
                return element;
            },
                    
            update: function(element, state) {
                if(state.page === (state.pageCount - 1))
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{LastPageLink}': {
            markup: '<span class="pui-paginator-last pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-end">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.getPageCount());
                    }
                });
                
                return element;
            },
            
            update: function(element, state) {
                if(state.page === (state.pageCount - 1))
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{PageLinks}': {
            markup: '<span class="pui-paginator-pages"></span>',
                    
            create: function(paginator) {
                var element = $(this.markup),
                boundaries = this.calculateBoundaries({
                    page: paginator.options.page,
                    pageLinks: paginator.options.pageLinks,
                    pageCount: paginator.getPageCount(),
                }),
                start = boundaries[0],
                end = boundaries[1];
                
                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLinkElement = $('<span class="pui-paginator-page pui-paginator-element ui-state-default ui-corner-all">' + pageLinkNumber + "</span>");
                    
                    if(i === paginator.options.page) {
                        pageLinkElement.addClass('ui-state-active');
                    }
                    
                    pageLinkElement.on('click.puipaginator', function(e){
                        var link = $(this);

                        if(!link.hasClass('ui-state-disabled')&&!link.hasClass('ui-state-active')) {
                            paginator.option('page', parseInt(link.text()) - 1);
                        }
                    });
                    
                    element.append(pageLinkElement);
                }

                return element;
            },
                    
            update: function(element, state) {
                var pageLinks = element.children(),
                boundaries = this.calculateBoundaries({
                    page: state.page,
                    pageLinks: state.pageLinks,
                    pageCount: state.pageCount,
                }),
                start = boundaries[0],
                end = boundaries[1],
                p = 0;
        
                pageLinks.filter('.ui-state-active').removeClass('ui-state-active');
                
                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLink = pageLinks.eq(p);
            
                    if(i === state.page) {
                        pageLink.addClass('ui-state-active');
                    }
                    
                    pageLink.text(pageLinkNumber);
            
                    p++;
                }
            },
                    
            calculateBoundaries: function(config) {
                var page = config.page,
                pageLinks = config.pageLinks,
                pageCount = config.pageCount,
                visiblePages = Math.min(pageLinks, pageCount);
                
                //calculate range, keep current in middle if necessary
                var start = Math.max(0, parseInt(Math.ceil(page - ((visiblePages) / 2)))),
                end = Math.min(pageCount - 1, start + visiblePages - 1);

                //check when approaching to last page
                var delta = pageLinks - (end - start + 1);
                start = Math.max(0, start - delta);
                
                return [start, end];
            }
        }
        
    };

    $.widget("primeui.puipaginator", {
       
        options: {
            pageLinks: 5,
            totalRecords: 0,
            page: 0,
            rows: 0,
            template: '{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}'
        },
        
        _create: function() {
            this.element.addClass('pui-paginator ui-widget-header');
            this.paginatorElements = [];
            
            var elementKeys = this.options.template.split(/[ ]+/);
            for(var i = 0; i < elementKeys.length;i++) {
                var elementKey = elementKeys[i],
                handler = ElementHandlers[elementKey];
        
                if(handler) {
                    var paginatorElement = handler.create(this);
                    this.paginatorElements[elementKey] = paginatorElement;
                    this.element.append(paginatorElement);
                }
            }
            
            this._bindEvents();
        },
                
        _bindEvents: function() {
            this.element.find('span.pui-paginator-element')
                    .on('mouseover.puipaginator', function() {
                        var el = $(this);
                        if(!el.hasClass('ui-state-active')&&!el.hasClass('ui-state-disabled')) {
                            el.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.puipaginator', function() {
                        var el = $(this);
                        if(el.hasClass('ui-state-hover')) {
                            el.removeClass('ui-state-hover');
                        }
                    });
        },
        
        _setOption: function(key, value) {
            if(key === 'page') {
                this._setPage(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
                
        _setPage: function(p) {
            var pc = this.getPageCount();
            
            if(p >= 0 && p < pc && this.options.page !== p) {        
                var newState = {
                    first: this.options.rows * p,
                    rows: this.options.rows,
                    page: p,
                    pageCount: pc,
                    pageLinks: this.options.pageLinks
                };
                
                this.options.page = p;
                this._updateUI(newState);
                this._trigger('paginate', null, newState);
            }
        },
                
        _updateUI: function(newState) {
            for(var paginatorElementKey in this.paginatorElements) {
                ElementHandlers[paginatorElementKey].update(this.paginatorElements[paginatorElementKey], newState);
            }
        },
                
        getPageCount: function() {
            return Math.ceil(this.options.totalRecords / this.options.rows)||1;
        }
    });
});

/*
 PrimeFaces.widget.Paginator = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this.cfg = cfg;
        this.jq = $();

        var _self = this;
        $.each(this.cfg.id, function(index, id){
            _self.jq = _self.jq.add($(PrimeFaces.escapeClientId(id)));
        });

        //elements
        this.pagesContainer = this.jq.children('.ui-paginator-pages');
        this.pageLinks = this.pagesContainer.children('.ui-paginator-page');
        this.rppSelect = this.jq.children('.ui-paginator-rpp-options');
        this.jtpSelect = this.jq.children('.ui-paginator-jtp-select');
        this.firstLink = this.jq.children('.ui-paginator-first');
        this.prevLink  = this.jq.children('.ui-paginator-prev');
        this.nextLink  = this.jq.children('.ui-paginator-next');
        this.endLink   = this.jq.children('.ui-paginator-last');
        this.currentReport = this.jq.children('.ui-paginator-current');

        //metadata
        this.cfg.rows = this.cfg.rows == 0 ? this.cfg.rowCount : this.cfg.rows;
        this.cfg.pageCount = Math.ceil(this.cfg.rowCount / this.cfg.rows)||1;
        this.cfg.pageLinks = this.cfg.pageLinks||10;
        this.cfg.currentPageTemplate = this.cfg.currentPageTemplate||'({currentPage} of {totalPages})';

        //event bindings
        this.bindEvents();
    },
            
    bindEvents: function(){
        var _self = this;

        //visuals for first,prev,next,last buttons
        this.jq.children('span.ui-state-default').mouseover(function(){
            var item = $(this);
            if(!item.hasClass('ui-state-disabled')) {
                item.addClass('ui-state-hover');
            }
        }).mouseout(function(){
            $(this).removeClass('ui-state-hover');
        });

        //page links
        this.bindPageLinkEvents();

        //records per page selection
        PrimeFaces.skinSelect(this.rppSelect);
        this.rppSelect.change(function(e) {
            if(!$(this).hasClass("ui-state-disabled")){
                _self.setRowsPerPage(parseInt($(this).val()));
            }
        });

        //jump to page
        PrimeFaces.skinSelect(this.jtpSelect);
        this.jtpSelect.change(function(e) {
            if(!$(this).hasClass("ui-state-disabled")){
                _self.setPage(parseInt($(this).val()));
            }
        });

        //First page link
        this.firstLink.click(function() {
            PrimeFaces.clearSelection();

            if(!$(this).hasClass("ui-state-disabled")){
                _self.setPage(0);
            }
        });

        //Prev page link
        this.prevLink.click(function() {
            PrimeFaces.clearSelection();

            if(!$(this).hasClass("ui-state-disabled")){
                _self.setPage(_self.cfg.page - 1);
            }
        });

        //Next page link
        this.nextLink.click(function() {
            PrimeFaces.clearSelection();

            if(!$(this).hasClass("ui-state-disabled")){
                _self.setPage(_self.cfg.page + 1);
            }
        });

        //Last page link
        this.endLink.click(function() {
            PrimeFaces.clearSelection();

            if(!$(this).hasClass("ui-state-disabled")){
                _self.setPage(_self.cfg.pageCount - 1);
            }
        });
    },
            
    bindPageLinkEvents: function(){
        var _self = this;

        this.pagesContainer.children('.ui-paginator-page').bind('click', function(e){
            var link = $(this);

            if(!link.hasClass('ui-state-disabled')&&!link.hasClass('ui-state-active')) {
                _self.setPage(parseInt(link.text()) - 1);
            }
        }).mouseover(function(){
            var item = $(this);
            if(!item.hasClass('ui-state-disabled')&&!item.hasClass('ui-state-active')) {
                item.addClass('ui-state-hover');
            }
        }).mouseout(function(){
            $(this).removeClass('ui-state-hover');
        });
    },
    
    updateUI: function() {  
        //boundaries
        if(this.cfg.page == 0) {
            this.firstLink.removeClass('ui-state-hover').addClass('ui-state-disabled');
            this.prevLink.removeClass('ui-state-hover').addClass('ui-state-disabled');
        }
        else {
            this.firstLink.removeClass('ui-state-disabled');
            this.prevLink.removeClass('ui-state-disabled');
        }

        if(this.cfg.page == (this.cfg.pageCount - 1)){
            this.nextLink.removeClass('ui-state-hover').addClass('ui-state-disabled');
            this.endLink.removeClass('ui-state-hover').addClass('ui-state-disabled');
        }
        else {
            this.nextLink.removeClass('ui-state-disabled');
            this.endLink.removeClass('ui-state-disabled');
        }

        //current page report
        var startRecord = (this.cfg.page * this.cfg.rows) + 1,
        endRecord = (this.cfg.page * this.cfg.rows) + this.cfg.rows;
        if(endRecord > this.cfg.rowCount) {
            endRecord = this.cfg.rowCount;
        }

        var text = this.cfg.currentPageTemplate
            .replace("{currentPage}", this.cfg.page + 1)
            .replace("{totalPages}", this.cfg.pageCount)
            .replace("{totalRecords}", this.cfg.rowCount)
            .replace("{startRecord}", startRecord)
            .replace("{endRecord}", endRecord);
        this.currentReport.text(text);

        //rows per page dropdown
        this.rppSelect.attr('value', this.cfg.rows);

        //jump to page dropdown
        if(this.jtpSelect.length > 0) {
            this.jtpSelect.children().remove();

            for(var i=0; i < this.cfg.pageCount; i++) {
                this.jtpSelect.append("<option value=" + i + ">" + (i + 1) + "</option>");
            }
            this.jtpSelect.attr('value', this.cfg.page);
        }

        //page links
        this.updatePageLinks();
    },
            
    updatePageLinks: function() {
        var start, end, delta;

        //calculate visible page links
        this.cfg.pageCount = Math.ceil(this.cfg.rowCount / this.cfg.rows)||1;
        var visiblePages = Math.min(this.cfg.pageLinks, this.cfg.pageCount);

        //calculate range, keep current in middle if necessary
        start = Math.max(0, Math.ceil(this.cfg.page - ((visiblePages) / 2)));
        end = Math.min(this.cfg.pageCount - 1, start + visiblePages - 1);

        //check when approaching to last page
        delta = this.cfg.pageLinks - (end - start + 1);
        start = Math.max(0, start - delta);

        //update dom
        this.pagesContainer.children().remove();
        for(var i = start; i <= end; i++) {
            var styleClass = 'ui-paginator-page ui-state-default ui-corner-all';
            if(this.cfg.page == i) {
                styleClass += " ui-state-active";
            }

            this.pagesContainer.append('<span class="' + styleClass + '">' + (i + 1) + '</span>')   
        }

        this.bindPageLinkEvents();
    },
            
    setPage: function(p, silent) {
        if(p >= 0 && p < this.cfg.pageCount && this.cfg.page != p){        
            var newState = {
                first: this.cfg.rows * p,
                rows: this.cfg.rows,
                page: p
            };

            if(silent) {
                this.cfg.page = p;
                this.updateUI();
            }
            else {
                this.cfg.paginate.call(this, newState);
            }
        }
    },
            
    setRowsPerPage: function(rpp) {
        var first = this.cfg.rows * this.cfg.page,
        page = parseInt(first / rpp);

        this.cfg.rows = rpp;

        this.cfg.pageCount = Math.ceil(this.cfg.rowCount / this.cfg.rows);

        this.cfg.page = -1;
        this.setPage(page);
    },
            
    setTotalRecords: function(value) {
        this.cfg.rowCount = value;
        this.cfg.pageCount = Math.ceil(value / this.cfg.rows)||1;
        this.cfg.page = 0;
        this.updateUI();
    },
            
    getCurrentPage: function() {
        return this.cfg.page;
    }
}); 
 
 */