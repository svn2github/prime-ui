/**
 * PrimeFaces InputTextarea Widget
 */
PrimeFaces.widget.InputTextarea = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.cfg.rowsDefault = this.jq.attr('rows');
        this.cfg.colsDefault = this.jq.attr('cols');
        
        //visuals
        PrimeFaces.enhanceInput(this.jq);
        
        //autoComplete
        if(this.cfg.autoComplete) {
            this.setupAutoComplete();
        }
        
        //autoResize
        if(this.cfg.autoResize) {
            this.setupAutoResize();
        }

        //maxLength
        if(this.cfg.maxlength) {
            this.applyMaxlength();
        }

        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.jq, this.cfg.behaviors);
        }
        
        //Counter
        if(this.cfg.counter) {
            this.counter = this.cfg.counter ? $(PrimeFaces.escapeClientId(this.cfg.counter)) : null;
            this.cfg.counterTemplate = this.cfg.counterTemplate||'{0}';
            this.updateCounter();
        }
    },
    
    refresh: function(cfg) {
        //remove autocomplete panel
        if(cfg.autoComplete) {
            $(PrimeFaces.escapeClientId(cfg.id + '_panel')).remove();
            $(PrimeFaces.escapeClientId('textarea_simulator')).remove();
        }
        
        this.init(cfg);
    },
    
    setupAutoResize: function() {
        var _self = this;

        this.jq.addClass('ui-inputtextarea-resizable');

        this.jq.keyup(function() {
            _self.resize();
        }).focus(function() {
            _self.resize();
        }).blur(function() {
            _self.resize();
        });
    },
    
    resize: function() {
        var linesCount = 0,
        lines = this.jq.val().split('\n');

        for(var i = lines.length-1; i >= 0 ; --i) {
            linesCount += Math.floor((lines[i].length / this.cfg.colsDefault) + 1);
        }

        var newRows = (linesCount >= this.cfg.rowsDefault) ? (linesCount + 1) : this.cfg.rowsDefault;

        this.jq.attr('rows', newRows);
    },
    
    applyMaxlength: function() {
        var _self = this;

        this.jq.keyup(function(e) {
            var value = _self.jq.val(),
            length = value.length;

            if(length > _self.cfg.maxlength) {
                _self.jq.val(value.substr(0, _self.cfg.maxlength));
            }
            
            if(_self.counter) {
                _self.updateCounter();
            }
        });
    },
    
    updateCounter: function() {
        var value = this.jq.val(),
        length = value.length;

        if(this.counter) {
            var remaining = this.cfg.maxlength - length,
            remainingText = this.cfg.counterTemplate.replace('{0}', remaining);

            this.counter.html(remainingText);
        }
    },
    
    setupAutoComplete: function() {
        var panelMarkup = '<div id="' + this.id + '_panel" class="ui-autocomplete-panel ui-widget-content ui-corner-all ui-helper-hidden ui-shadow"></div>',
        _self = this;
        
        this.panel = $(panelMarkup).appendTo(document.body);
        
        this.jq.keyup(function(e) {
            var keyCode = $.ui.keyCode;
            
            switch(e.which) {
                
                case keyCode.UP:
                case keyCode.LEFT:
                case keyCode.DOWN:
                case keyCode.RIGHT:
                case keyCode.ENTER:
                case keyCode.NUMPAD_ENTER:
                case keyCode.TAB:
                case keyCode.SPACE:
                case keyCode.CONTROL:
                case keyCode.ALT:
                case keyCode.ESCAPE:
                case 224:   //mac command
                    //do not search
                break;

                default:
                    var query = _self.extractQuery();           
                    if(query && query.length >= _self.cfg.minQueryLength) {
                        
                         //Cancel the search request if user types within the timeout
                        if(_self.timeout) {
                            _self.clearTimeout(_self.timeout);
                        }
                        
                        _self.timeout = setTimeout(function() {
                            _self.search(query);
                        }, _self.cfg.queryDelay);
                        
                    }
                break;
            }

        }).keydown(function(e) {
            var overlayVisible = _self.panel.is(':visible'),
            keyCode = $.ui.keyCode;

            switch(e.which) {
                case keyCode.UP:
                case keyCode.LEFT:
                    if(overlayVisible) {
                        var highlightedItem = _self.items.filter('.ui-state-highlight'),
                        prev = highlightedItem.length == 0 ? _self.items.eq(0) : highlightedItem.prev();

                        if(prev.length == 1) {
                            highlightedItem.removeClass('ui-state-highlight');
                            prev.addClass('ui-state-highlight');
                        }
                        
                        if(_self.cfg.scrollHeight) {
                            _self.alignScrollbar(prev);
                        }

                        e.preventDefault();
                    }
                    else {
                        _self.clearTimeout();
                    }
                break;

                case keyCode.DOWN:
                case keyCode.RIGHT:
                    if(overlayVisible) {
                        var highlightedItem = _self.items.filter('.ui-state-highlight'),
                        next = highlightedItem.length == 0 ? _self.items.eq(0) : highlightedItem.next();
                        
                        if(next.length == 1) {
                            highlightedItem.removeClass('ui-state-highlight');
                            next.addClass('ui-state-highlight');
                        }
                        
                        if(_self.cfg.scrollHeight) {
                            _self.alignScrollbar(next);
                        }

                        e.preventDefault();
                    }
                    else {
                        _self.clearTimeout();
                    }
                break;

                case keyCode.ENTER:
                case keyCode.NUMPAD_ENTER:
                    if(overlayVisible) {
                        _self.items.filter('.ui-state-highlight').trigger('click');

                        e.preventDefault();
                    }
                    else {
                        _self.clearTimeout();
                    } 
                break;

                case keyCode.SPACE:
                case keyCode.CONTROL:
                case keyCode.ALT:
                case keyCode.BACKSPACE:
                case keyCode.ESCAPE:
                case 224:   //mac command
                    _self.clearTimeout();

                    if(overlayVisible) {
                        _self.hide();
                    }
                break;
  
                case keyCode.TAB:
                    _self.clearTimeout();
                    
                    if(overlayVisible) {
                        _self.items.filter('.ui-state-highlight').trigger('click');
                        _self.hide();
                    }
                break;
            }
        });
        
        //hide panel when outside is clicked
        $(document.body).bind('mousedown.ui-inputtextarea', function (e) {
            if(_self.panel.is(":hidden")) {
                return;
            }
            var offset = _self.panel.offset();
            if(e.target === _self.jq.get(0)) {
                return;
            }
            
            if (e.pageX < offset.left ||
                e.pageX > offset.left + _self.panel.width() ||
                e.pageY < offset.top ||
                e.pageY > offset.top + _self.panel.height()) {
                _self.hide();
            }
        });
        
        //Hide overlay on resize
        var resizeNS = 'resize.' + this.id;
        $(window).unbind(resizeNS).bind(resizeNS, function() {
            if(_self.panel.is(':visible')) {
                _self.hide();
            }
        });

        //dialog support
        this.setupDialogSupport();
    },
        
    bindDynamicEvents: function() {
        var _self = this;

        //visuals and click handler for items
        this.items.bind('mouseover', function() {
            var item = $(this);
            
            if(!item.hasClass('ui-state-highlight')) {
                _self.items.filter('.ui-state-highlight').removeClass('ui-state-highlight');
                item.addClass('ui-state-highlight');
            }
        })
        .bind('click', function(event) {
            var item = $(this),
            itemValue = item.attr('data-item-value'),
            insertValue = itemValue.substring(_self.query.length);
            
            _self.jq.focus();
            
            _self.jq.insertText(insertValue, _self.jq.getSelection().start, true);
            
            _self.invokeItemSelectBehavior(event, itemValue);
            
            _self.hide();
        });
    },
    
    invokeItemSelectBehavior: function(event, itemValue) {
        if(this.cfg.behaviors) {
            var itemSelectBehavior = this.cfg.behaviors['itemSelect'];

            if(itemSelectBehavior) {
                var ext = {
                    params : [
                        {name: this.id + '_itemSelect', value: itemValue}
                    ]
                };

                itemSelectBehavior.call(this, event, ext);
            }
        }
    },
    
    clearTimeout: function() {
        if(this.timeout) {
            clearTimeout(this.timeout);
        }
        
        this.timeout = null;
    },
    
    extractQuery: function() {
        var end = this.jq.getSelection().end,
        result = /\S+$/.exec(this.jq.get(0).value.slice(0, end)),
        lastWord = result ? result[0] : null;
    
        return lastWord;
    },
    
    search: function(q) {
        this.query = q;
        
        var request = {
            query: q 
        };
        
        if(this.cfg.completeSource) {
            this.cfg.completeSource.call(this, request, this.jsonResponse);
        }
        else {
            this.facesRequest.call(this, request);
        }
    },
        
    facesRequest: function(request) {
        var _self = this;
        this.query = request.query;
        
        var options = {
            source: this.id,
            update: this.id,
            onsuccess: function(responseXML) {
                var xmlDoc = $(responseXML.documentElement),
                updates = xmlDoc.find("update");

                for(var i=0; i < updates.length; i++) {
                    var update = updates.eq(i),
                    id = update.attr('id'),
                    data = update.text();

                    if(id == _self.id) {
                        _self.panel.html(data);
                        _self.items = _self.panel.find('.ui-autocomplete-item');
                        
                        _self.bindDynamicEvents();
                        
                        if(_self.items.length > 0) {                            
                            //highlight first item
                            _self.items.eq(0).addClass('ui-state-highlight');
                            
                            //adjust height
                            if(_self.cfg.scrollHeight && _self.panel.height() > _self.cfg.scrollHeight) {
                                _self.panel.height(_self.cfg.scrollHeight);
                            }

                            if(_self.panel.is(':hidden')) {
                                _self.show();
                            } 
                            else {
                                _self.alignPanel(); //with new items
                            }

                        }
                        else {
                            _self.panel.hide();
                        }
                    } 
                    else {
                        PrimeFaces.ajax.AjaxUtils.updateElement.call(this, id, data);
                    }
                }

                PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, xmlDoc);

                return true;
            }
        };

        options.params = [
          {name: this.id + '_query', value: this.query}  
        ];
        
        PrimeFaces.ajax.AjaxRequest(options);
    },
        
    jsonResponse: function(data) {
        this.panel.html('');
        
        var listContainer = $('<ul class="ui-autocomplete-items ui-autocomplete-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>');

        for(var i = 0; i < data.length; i++) {
            var item = $('<li class="ui-autocomplete-item ui-autocomplete-list-item ui-corner-all"></li>');
            item.attr('data-item-value', data[i].value);
            item.text(data[i].label);
            
            listContainer.append(item);
        }
        
        this.panel.append(listContainer).show();
        this.items = this.panel.find('.ui-autocomplete-item');
                        
        this.bindDynamicEvents();

        if(this.items.length > 0) {                            
            //highlight first item
            this.items.eq(0).addClass('ui-state-highlight');

            //adjust height
            if(this.cfg.scrollHeight && this.panel.height() > this.cfg.scrollHeight) {
                this.panel.height(this.cfg.scrollHeight);
            }

            if(this.panel.is(':hidden')) {
                this.show();
            } 
            else {
                this.alignPanel(); //with new items
            }

        }
        else {
            this.panel.hide();
        }
    },
    
    alignPanel: function() {
        var pos = this.jq.getCaretPosition(),
        offset = this.jq.offset();
        
        this.panel.css({
                        'left': offset.left + pos.left,
                        'top': offset.top + pos.top,
                        'width': this.jq.innerWidth(),
                        'z-index': ++PrimeFaces.zindex
                });
    },
    
    alignScrollbar: function(item) {
        var relativeTop = item.offset().top - this.items.eq(0).offset().top,
        visibleTop = relativeTop + item.height(),
        scrollTop = this.panel.scrollTop(),
        scrollBottom = scrollTop + this.cfg.scrollHeight,
        viewportCapacity = parseInt(this.cfg.scrollHeight / item.outerHeight(true));
        
        //scroll up
        if(visibleTop < scrollTop) {
            this.panel.scrollTop(relativeTop);
        }
        //scroll down
        else if(visibleTop > scrollBottom) {
            var viewportTopitem = this.items.eq(item.index() - viewportCapacity + 1);
            
            this.panel.scrollTop(viewportTopitem.offset().top - this.items.eq(0).offset().top);
        }
    },
    
    show: function() {
        this.alignPanel();

        this.panel.show();
    },
    
    hide: function() {        
        this.panel.hide();
    },
    
    setupDialogSupport: function() {
        var dialog = this.jq.parents('.ui-dialog:first');

        if(dialog.length == 1) {
            this.panel.css('position', 'fixed');
        }
    }
    
});

/**
 * jQuery Plugin for InputText Widget
 */
(function( $ ) {
  
  $.fn.inputtextarea = function(options) {
      
      var cfg = $.extend({
        'autoResize':false
        ,'autoComplete':false
        ,'maxlength':null
        ,'counter':null
        ,'minQueryLength':3
        ,'queryDelay':700
      }, options);
      
      return this.each(function() {
         cfg.id = this.id;
         
         new PrimeFaces.widget.InputTextarea(cfg);
      });
  };
  
})(jQuery);