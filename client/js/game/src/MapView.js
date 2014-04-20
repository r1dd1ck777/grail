// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapView = function(options){
        this.initialize(options);
    }
    var p = MapView.prototype = new createjs.EventDispatcher();
    p.EventDispatcher_initialize = p.initialize;
    p.mapStage = null;

    p.initialize = function(options){
        var mapView = this;
        mapView.EventDispatcher_initialize();
        mapView.options = options;
        mapView.mapStage = gg.MapViewUtils.createMapStage(mapView.options.mapCanvasId);

//        jQuery(window).keydown(function(e){
//            if(e.which === 40){
//                mapStage.y -= 3;
//            }else if(e.which === 38){
//                mapStage.y += 3;
//            }else if(e.which === 39){
//                mapStage.x -= 3;
//            }else if(e.which === 37){
//                mapStage.x += 3;
//            }
//        });

        createjs.Ticker.addEventListener("tick", mapView.mapStage);
        createjs.Ticker.setFPS(50);
    }

    p.moveMapTo = function(x, y){

    };

    gg.MapView = MapView;
})();