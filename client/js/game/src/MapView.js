// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapView = function(canvasId){
        this.initialize();
        this._init(canvasId);
    }
    var p = MapView.prototype = new createjs.EventDispatcher();
    MapView.mapStage = null;

    p._init = function(canvasId){
        var mapView = this;
        var mapStage = mapView.mapStage;

        mapStage = new createjs.Stage(canvasId);

        var mapContainer = gg.MapViewUtils.createMapContainer(mapView);

        mapStage.addChild(mapContainer);
        mapStage.enableMouseOver();

        var c = new createjs.Shape();
        c.graphics.beginFill("black").dc(0,0,8);
        mapContainer.addChild(c);
        c.scaleX = 1.5;
        c.x = -1000;
        c.y = -1000;

        mapView.on(gg.Events.viewCellMouseClick , function(e){
            var point = e.originalEvent.target.localToLocal(10,10, mapContainer);
            c.x = point.x;
            c.y = point.y;
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

        createjs.Ticker.addEventListener("tick", mapStage);
    }

    p.moveMap = function(){

    };

    gg.MapView = MapView;
})();