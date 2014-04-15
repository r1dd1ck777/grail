// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapViewUtils = function(){
    }
    MapViewUtils.createMapContainer = function(view){
        var terrainContainer = MapViewUtils.createTerrainContainer(view);
        var mapContainer = new createjs.Container();
        mapContainer.addChild(terrainContainer);

        return mapContainer;
    }
    MapViewUtils.createTerrainContainer = function(view){
        var grid = MapViewUtils.createGridContainer(view);
        var container = new createjs.Container();
        container.addChild(grid);
        container.scaleX = 1.5;

        return container;
    }
    MapViewUtils.createGridContainer = function(mapView){
        var container = new createjs.Container();

        var gridLines = new createjs.Shape();
        gridLines.graphics.beginStroke("#000");

        for(var i = 0; i <= 500 / 20; i++){
            var diff = i*20;
            gridLines.graphics.mt(0, diff).lt(500, diff);
            gridLines.graphics.mt(diff, 0).lt(diff, 500);
        }

        var mapCells = MapViewUtils.getCells();

        for(var k in mapCells){
            mapCells[k].v.on("mouseover", function(evt) {
                var e = new createjs.Event(gg.Events.viewCellMouseOver);
                e.originalEvent = evt;
                mapView.dispatchEvent(e);
            });
            mapCells[k].v.on("click", function(){
                return function(evt) {
                    var e = new createjs.Event(gg.Events.viewCellMouseClick);
                    e.originalEvent = evt;
                    e.mapCellData = mapCells[k].cellData;
                    console.log(mapCells[k]);
                    mapView.dispatchEvent(e);
                }
            }());
            mapCells[k].v.on("mouseout", function(evt) {
                var e = new createjs.Event(gg.Events.viewCellMouseOut);
                e.originalEvent = evt;
                mapView.dispatchEvent(e);
            });

            container.addChild(mapCells[k].v);
        }

        container.addChild(gridLines);
        container.rotation = 45;

        return container;
    }

    MapViewUtils.getCells = function(){
        var mapSize = 25;
        var cells = [];

        for(var i = 0; i <= mapSize; i++){
            for(var j = 0; j <= mapSize; j++){
                cells.push(new gg.MapCell({
                    cX: i,
                    cY: j
                }));
            }
        }

        return cells;
    }

    gg.MapViewUtils = MapViewUtils;
})();