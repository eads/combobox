(function( $ ) {
  $.widget( "ui.combobox", {
    _create: function() {
      var self = this,
        select = this.element.hide(),
        selected = select.children( ":selected" ),
        value = selected.val() ? selected.text() : "";

      var wrapper = select
        .wrap('<div class="combobox-js-wrapper">')
        .parent();
      
      var input = $( '<input type="text">' )
        .insertAfter( select )
        .val( value )
      
      var button = $( "<button class='combobox-arrow'><i class='icon-chevron-down'></i></button>" )
        .attr( "tabIndex", -1 )
        .attr( "title", "Show All Items" )
        .insertAfter( input )
        .button({
          text: false
        });

      if (!select.attr('disabled') && !select.attr('readonly')) {
        input.autocomplete({
          delay: 0,
          minLength: 0,
          source: function( request, response ) {
            var ac = this;
            var source_init = true; 
            var matcher = new RegExp('^(' + $.ui.autocomplete.escapeRegex(request.term) + ')', "i" );
            response( select.children( "option" ).map(function() {
              var value = text = $( this ).text();
              return {
                label: text,
                value: value,
                option: this
              };
            }));
            ac.widget().children(".ui-menu-item").each(function(i) {
              var item = $(this).data("item.autocomplete");
              ac.menu.next($.Event('source'));
              if (matcher.test(item.label) || matcher.test(item.value) || matcher.test(item)) {
                ac.menu.element.scrollTop(ac.menu.element.scrollTop() + $(this).position().top );
                return false;
              }
            });
          },
          select: function( event, ui ) {
            ui.item.option.selected = true;
            self._trigger( "selected", event, {
              item: ui.item.option
            });
            select.change();
          },
          change: function( event, ui ) {
            if ( !ui.item ) {
              var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ), "i" ),
                valid = false;

              // Set original field value
              select.children( "option" ).each(function() {
                if ( $(this).text().match( matcher ) ) {
                  this.selected = valid = true;
                  select.change();
                  return false;
                }
              });
              if ( !valid ) {
                // remove invalid value, as it didn't match anything
                $( this ).val( "" );
                select.val( "" );
                return false;
              }
            }
          }
        });

        button.click(function() {
          // close if already visible
          if ( input.attr('readonly') || input.attr('disabled') ) {
            return false;
          }
          if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
            input.autocomplete( "close" );
            return;
          }

          // Search for whatever is currently in box when button is
          // clicked
          input.autocomplete( "search", input.val() );
          input.focus();
      
          // Don't submit form
          return false;
        });

        input.data( "autocomplete" )._renderItem = function( ul, item ) {
          return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + item.label + "</a>" )
            .appendTo( ul );
        };

        input.bind('keydown', function(e) {
          if (e.keyCode == 38 || e.keyCode == 40){
            var ac = $(this).data('autocomplete');
            var active = $('#ui-active-menuitem');
            if (e.keyCode == 38 && active.get(0) && active.position && active.position().top < 0) {
              ac.menu.element.scrollTop( ac.menu.element.scrollTop() + active.position().top );
            }
            if (e.keyCode == 40 && active.get(0) && active.parent().next() && active.parent().next().position().top + active.parent().next().height() > ac.menu.element.height()) {
              ac.menu.element.scrollTop(ac.menu.element.scrollTop() - ac.menu.element.height() + active.parent().next().position().top); 
            }
          }
        });  
      }
      else if (select.attr('readonly') && !select.attr('disabled')) {
        input.attr('readonly', true);
        button.attr('disabled', true);
      }
      else if (select.attr('disabled')) {
        input.attr('disabled', true);
        button.attr('disabled', true);
      }            
    }
  });

})( jQuery );

