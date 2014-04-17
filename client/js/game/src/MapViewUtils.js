// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapViewUtils = function(){
    }
    MapViewUtils.createMapStage = function(mapView){
        var mapStage = new createjs.Stage(mapView.options.mapCanvasId);
        mapStage.enableMouseOver();

        // layer 1
        var bgContainer =  gg.MapViewUtils.createBgContainer();
        mapStage.addChild(bgContainer);
        // layer 2 - map cells
        var mapContainer = gg.MapViewUtils.createMapCellsContainer(mapView);
        mapStage.addChild(mapContainer);
        // layer 3 - map decor (trees, towns, items (?) )
        // layer 4 - cursor, flags
        // layer 5 - units
        // layer 6 - effects
        // layer 7 - fog of war

        return mapStage;
    }
    MapViewUtils.createBgContainer = function(){
        var container = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginFill("black").r(0,0,500,500);
        container.addChild(bg);

        return container;
    }
    MapViewUtils.createMapCellsContainer = function(view){
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
        var b = container.getBounds();
        container.cache(b.x, b.y, b.width, b.height);

        return container;
    }
    MapViewUtils.createGridContainer = function(mapView){
        var container = new createjs.Container();

        var mapCells = MapViewUtils.getCells();

        for(var k in mapCells){
            var mapCell = mapCells[k];
            mapCell.on("mouseover", function(evt) {
                var e = new createjs.Event(gg.Events.viewCellMouseOver);
                e.mouseEvent = evt;
                mapView.dispatchEvent(e);
            });
            mapCell.on("click", function(evt) {
                var e = new createjs.Event(gg.Events.viewCellMouseClick);
                e.mouseEvent = evt;
                mapView.dispatchEvent(e);
            });
            mapCell.on("mouseout", function(evt) {
                var e = new createjs.Event(gg.Events.viewCellMouseOut);
                e.mouseEvent = evt;
                mapView.dispatchEvent(e);
            });

            container.addChild(mapCells[k]);
        }
        container.rotation = 45;

        return container;
    }

    MapViewUtils.getCells = function(){
        var mapSize = gg.Config.MAP_SIZE;
        var cells = [];

        for(var i = 0; i <= mapSize; i++){
            for(var j = 0; j <= mapSize; j++){
                cells.push(new gg.MapCellView({
                    nX: i,
                    nY: j,
                    imageOrUri: gg.loadQueue.getResult('grass')
                }));
            }
        }

        return cells;
    }

    gg.MapViewUtils = MapViewUtils;
})();