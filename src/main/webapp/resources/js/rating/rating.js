/**
 * PrimeUI Spinner widget
 */
$(function() {

    $.widget("primeui.rating", {
       
        options: {
            stars: 5,
            cancel: true
        },
        
        _create: function() {
            var input = this.element;
            
            input.wrap('<div />');
            this.container = input.parent();
            this.container.addClass('ui-rating');
            
            var inputVal = input.val(),
            value = inputVal == '' ? null : parseInt(inputVal);
            
            if(this.options.cancel) {
                this.container.append('<div class="ui-rating-cancel"><a></a></div>');
            }

            for(var i = 0; i < this.options.stars; i++) {
                var styleClass = (value > i) ? "ui-rating-star ui-rating-star-on" : "ui-rating-star";

                this.container.append('<div class="' + styleClass + '"><a></a></div>');
            }
            
            this.stars = this.container.children('.ui-rating-star');

            if(input.prop('disabled')) {
                this.container.addClass('ui-state-disabled');
            }
            else if(!input.prop('readonly')){
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;

            this.stars.click(function() {
                var value = $this.stars.index(this) + 1;   //index starts from zero

                $this._setValue(value);
            });

            this.container.children('.ui-rating-cancel').hover(function() {
                $(this).toggleClass('ui-rating-cancel-hover');
            })
            .click(function() {
                $this.cancel();
            });
        },
        
        cancel: function() {
            this.element.val('');
        
            this.stars.filter('.ui-rating-star-on').removeClass('ui-rating-star-on');
        },
        
        _getValue: function() {
            var inputVal = this.element.val();

            return inputVal == '' ? null : parseInt(inputVal);
        },

        _setValue: function(value) {
            this.element.val(value);

            //update visuals
            this.stars.removeClass('ui-rating-star-on');
            for(var i = 0; i < value; i++) {
                this.stars.eq(i).addClass('ui-rating-star-on');
            }
            
            this._trigger('rate');
        }
    });
    
});