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

        // DRAG events
        mapContainer.isDragging = false;
        mapContainer.on('mousedown', function(e){
            if (e.nativeEvent.button == 1){
                mapContainer.dragStartPoint = {
                    x: e.stageX,
                    y: e.stageY
                }
                mapContainer.lastPoint = {
                    x: mapContainer.x,
                    y: mapContainer.y
                }
                mapContainer.isDragging = true;

                var newE = new createjs.Event(gg.ViewEvents.MAP_MOUSE_DRAG_START);
                mapContainer.dispatchEvent(newE);
            }
        });
        mapContainer.on('pressup', function(e){
            if (e.nativeEvent.button == 1){
                mapContainer.isDragging = false;

                var newE = new createjs.Event(gg.ViewEvents.MAP_MOUSE_DRAG_STOP);
                mapContainer.dispatchEvent(newE);
            }
        });
        mapContainer.on('pressmove', function(e){
            if (mapContainer.isDragging){
                mapContainer.x = mapContainer.lastPoint.x + (e.stageX - mapContainer.dragStartPoint.x);
                mapContainer.y = mapContainer.lastPoint.y + (e.stageY - mapContainer.dragStartPoint.y);

                var newE = new createjs.Event(gg.ViewEvents.MAP_MOUSE_DRAG);
                mapContainer.dispatchEvent(newE);
            }
        });

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
        container.targetCursor = targetCursor;

        var overCursor = new createjs.Shape();
        overCursor.graphics.beginFill("green").dc(0,0,8);
        container.addChild(overCursor);
        overCursor.scaleX = 1.5;
        overCursor.x = -1000;
        overCursor.y = -1000;
        container.overCursor = overCursor;

        var selectCursor = new createjs.Shape();
        selectCursor.graphics.beginFill("red").dc(0,0,8);
        container.addChild(selectCursor);
        selectCursor.scaleX = 1.5;
        selectCursor.x = -1000;
        selectCursor.y = -1000;
        container.selectCursor = selectCursor;

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
        }
        container.rotation = 45;
        container.cellsMatrix = cellsMatrix;

        return container;
    }

    gg.MapViewUtils = MapViewUtils;
})();