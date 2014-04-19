// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapViewUtils = function(){
    }
    MapViewUtils.createMapStage = function(mapCanvasId){
        var mapStage = new createjs.Stage(mapCanvasId);
        mapStage.enableMouseOver();

        var bgContainer =  gg.MapViewUtils.createBgContainer();
        mapStage.bgContainer = bgContainer;
        mapStage.addChild(bgContainer);

        var mapContainer = new gg.MapViewUtils.createMapContainer();
        mapStage.mapContainer = mapContainer;
        mapStage.addChild(mapContainer);

        return mapStage;
    }

    MapViewUtils.createMapContainer = function(){
        var mapContainer = new createjs.Container();
        // layer 1 - terrain. map cells
        var terrainContainer = gg.MapViewUtils.createTerrainContainer();
        mapContainer.terrainContainer = terrainContainer;
        mapContainer.addChild(terrainContainer);
        // layer 2 - map decor (trees, towns, items (?) )
        // layer 3 - cursor, flags
        var mapCursorContainer = gg.MapViewUtils.createCursorContainer();
        mapContainer.mapCursorContainer = mapCursorContainer;
        mapContainer.addChild(mapCursorContainer);
        // layer 4 - units
        // layer 5 - effects
        // layer 6 - fog of war

        return mapContainer;
    }

    MapViewUtils.createCursorContainer = function(){
        var container = new createjs.Container();
        var targetCursor = new createjs.Shape();
        targetCursor.graphics.beginFill("black").dc(0,0,8);
        container.addChild(targetCursor);
        targetCursor.scaleX = 1.5;
        targetCursor.x = -1000;
        targetCursor.y = -1000;

//        var HALF_OF_CELL = parseInt(gg.Config.CELL_SIZE / 2);
//        mapView.on(gg.Events.viewCellMouseClick , function(e){
//            var point = e.mouseEvent.target.localToLocal(HALF_OF_CELL, HALF_OF_CELL, mapCellsContainer);
//            targetCursor.x = point.x;
//            targetCursor.y = point.y;
//            console.log(e);
//        });

        container.targetCursor = targetCursor;

        return container;
    }
    MapViewUtils.createBgContainer = function(){
        var container = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginFill("black").r(0,0,500,500);
        container.addChild(bg);
        container.bg = bg;

        return container;
    }
    MapViewUtils.createMapCellsContainer = function(view){
        var terrainContainer = MapViewUtils.createTerrainContainer(view);
        var mapContainer = new createjs.Container();
        mapContainer.addChild(terrainContainer);

        return mapContainer;
    }

    // scale rotated square
    MapViewUtils.createTerrainContainer = function(){
        var grid = MapViewUtils.createCellsContainer();
        var container = new createjs.Container();
        container.addChild(grid);
        container.scaleX = 1.5;
        var b = container.getBounds();
        container.cache(b.x, b.y, b.width, b.height);

        container.grid = grid;

        return container;
    }

    // create and rotate square
    // map cells here
    MapViewUtils.createCellsContainer = function(){
        var container = new createjs.Container();
        var cellsMatrix = gg.Save.getMapCellViewMatrix(gg.Save.getMapCellModelMatrix());

        for(var i in cellsMatrix){
            for(var j in cellsMatrix[i]){
                container.addChild(cellsMatrix[i][j]);
            }
//            mapCell.on("mouseover", function(evt) {
//                var e = new createjs.Event(gg.Events.viewCellMouseOver);
//                e.mouseEvent = evt;
//                mapView.dispatchEvent(e);
//            });
//            mapCell.on("click", function(evt) {
//                var e = new createjs.Event(gg.Events.viewCellMouseClick);
//                e.mouseEvent = evt;
//                mapView.dispatchEvent(e);
//            });
//            mapCell.on("mouseout", function(evt) {
//                var e = new createjs.Event(gg.Events.viewCellMouseOut);
//                e.mouseEvent = evt;
//                mapView.dispatchEvent(e);
//            });


        }
        container.rotation = 45;
        container.cellsMatrix = cellsMatrix;

        return container;
    }

    gg.MapViewUtils = MapViewUtils;
})();