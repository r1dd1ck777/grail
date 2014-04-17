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
        mapView.mapStage = gg.MapViewUtils.createMapStage(mapView);

        var c = new createjs.Shape();
        c.graphics.beginFill("black").dc(0,0,8);
        mapContainer.addChild(c);
        c.scaleX = 1.5;
        c.x = -1000;
        c.y = -1000;

        var HALF_OF_CELL = parseInt(gg.Config.CELL_SIZE / 2);
        mapView.on(gg.Events.viewCellMouseClick , function(e){
            var point = e.mouseEvent.target.localToLocal(HALF_OF_CELL, HALF_OF_CELL, mapContainer);
            c.x = point.x;
            c.y = point.y;
            console.log(e);
        });

        jQuery(window).keydown(function(e){
            if(e.which === 40){
                mapStage.y -= 3;
            }else if(e.which === 38){
                mapStage.y += 3;
            }else if(e.which === 39){
                mapStage.x -= 3;
            }else if(e.which === 37){
                mapStage.x += 3;
            }
        });

        mapStage.on("pressmove",function(evt) {
            mapContainer.x = mapContainer.lastPoint.x + (evt.stageX - mapContainer.lastMousedownPoint.x);
            mapContainer.y = mapContainer.lastPoint.y + (evt.stageY - mapContainer.lastMousedownPoint.y);
        });
        mapContainer.on("mousedown",function(evt) {
            mapContainer.lastMousedownPoint = {
                x: evt.stageX, y: evt.stageY
            }
            mapContainer.lastPoint = {
                x: mapContainer.x, y: mapContainer.y
            }
        });

        createjs.Ticker.addEventListener("tick", mapStage);
        createjs.Ticker.setFPS(50);
    }

    p.moveMapTo = function(x, y){

    };

    gg.MapView = MapView;
})();