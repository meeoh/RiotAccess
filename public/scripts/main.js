(function($) {
    // Init Skrollr
    var s = skrollr.init({    	
        render: function(data) {
            //Debugging - Log the current scroll position.
            
          //  console.log(data.curTop);
        }
    });

    skrollr.menu.init(s);

})(jQuery);
