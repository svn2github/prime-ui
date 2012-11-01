$(function() {
   $('#sidebar .widget-link:not(.ui-state-active)').hover(function(){
      $(this).toggleClass('ui-state-hover');
   }); 
});