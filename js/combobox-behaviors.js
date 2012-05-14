(function($) {
  Drupal.behaviors.combobox = {
    attach: function(context) {
      $('select.combobox', context).combobox();
    }
  }
})(jQuery);
