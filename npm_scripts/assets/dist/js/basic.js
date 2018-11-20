;(function($){
    'use strict';

    $(function(){

       $(".image-container").on("click", function(){

         var left = Math.floor(Math.random()*window.innerWidth);
         var top = Math.floor(Math.random()*window.innerHeight);

         $("<img>").attr("src","assets/dist/img/gulp.png").css("position", "absolute").css("left", left+"px").css("top", top+"px").appendTo("body");

       });

    });

})(jQuery);
