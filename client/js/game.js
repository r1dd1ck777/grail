'use strict';
// namespace:
this.gg = this.gg||{};

angular.module('game', [])

;

(function($){
    $(document).ready(function(){
        var loadQueue = new createjs.LoadQueue();
        loadQueue.on("complete", function(){
            gg.resources = loadQueue;
            var game = new gg.Game({
                mapCanvasId: 'map-canvas'
            });
        });
        loadQueue.loadManifest([
            {id: "grass", src:"images/terrain/grass.jpg"}
        ]);
        $('body').on('contextmenu', 'canvas', function(e){
            return false;
        });
//        $('body').on('click', 'canvas', function(e){
//            console.log('click');
//            console.log(e);
//        });
//        $('body').on('mousedown', 'canvas', function(e){
//            console.log('mousedown');
//            console.log(e);
//        });
//        $('body').on('mouseup', 'canvas', function(e){
//            console.log('mouseup');
//            console.log(e);
//        });
    });
})(jQuery);

