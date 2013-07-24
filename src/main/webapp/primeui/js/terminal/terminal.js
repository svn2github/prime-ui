/**
 * PrimeUI Terminal widget
 */
$(function() {

    $.widget("primeui.puiterminal", {
       
        options: {
            welcomeMessage: '',
            prompt:'prime $'
        },
        
        _create: function() {
            this.element.addClass('pui-terminal ui-widget ui-widget-content ui-corner-all')
                        .append( '<div>' + this.options.welcomeMessage + '</div>' )
                        .append( '<div class="pui-terminal-content"></div>' )
                        .append( '<div><span class="pui-terminal-prompt">' + this.options.prompt + '</span>' +
                                 '<input type="text" class="pui-terminal-input" autocomplete="off"></div>' );
                         
            this.promptContainer = this.element.find('> div:last-child > span.pui-terminal-prompt');
            this.content = this.element.children('.pui-terminal-content');
            this.input = this.promptContainer.next('');
            this.commands = [];
            this.commandIndex = 0;
            
            this._bindEvents();
        },
                
        _bindEvents: function() {
            var $this = this;

            this.input.on('keydown.terminal', function(e) {
                var keyCode = $.ui.keyCode;

                switch(e.which) {
                    case keyCode.UP:
                        if($this.commandIndex > 0) {
                            $this.input.val($this.commands[--$this.commandIndex]);
                        }

                        e.preventDefault();
                    break;

                    case keyCode.DOWN:
                        if($this.commandIndex < ($this.commands.length - 1)) {
                            $this.input.val($this.commands[++$this.commandIndex]);
                        }
                        else {
                            $this.commandIndex = $this.commands.length;
                            $this.input.val('');
                        }

                        e.preventDefault();
                    break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        $this._processCommand();

                        e.preventDefault();
                    break;
                }
            });        
    },
                
    _processCommand: function() {
        this.commands.push(this.input.val());
        this.commandIndex++;

        var tokens = this.input.val().split(" "),
        command = tokens[0],
        args = (tokens.length === 1) ? '-' : tokens.slice(1, tokens.length);             

        var request = {
            command: command,
            params:args        
        };

        if(this.options.commandHandler) {
            if($.type(this.options.commandHandler) === 'function')
                this.options.commandHandler.call(this, request, this._updateContent);
        }


    },

    _updateContent: function(content) {
        var commandResponseContainer = $('<div></div>');
        commandResponseContainer.append('<span>' + this.options.prompt + '</span><span class="pui-terminal-command">' +  this.input.val() + '</span>')
                                .append('<div>' + content + '</div>').appendTo(this.content);

        this.input.val('');
        this.element.scrollTop(this.content.height());
    },
    
    clear: function() {
        this.content.html('');
        this.input.val('');
    }
                               
       
    });
});