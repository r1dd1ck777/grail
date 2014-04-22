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
    p._mouseInterval = null;

    p.initialize = function(options){
        var mapView = this;
        mapView.EventDispatcher_initialize();
        mapView.options = options;
        mapView.mapStage = gg.MapViewUtils.createMapStage(mapView.options.mapCanvasId);

        mapView.selectedCell = new createjs.Point(1,1);
        mapView.targetedCell = new createjs.Point(1,2);

        // cell events
        var _currentMouseCell = null, _oldMouseCell = null;
        mapView._mouseInterval = setInterval(function(){
            _currentMouseCell = mapView.getCellViewUnder(mapView.mapStage.mouseX, mapView.mapStage.mouseY);
            if (_currentMouseCell === _oldMouseCell){
                return;
            }

            if (Boolean(_oldMouseCell)){
                var newE = new createjs.Event(gg.ViewEvents.CELL_MOUSE_OUT);
                newE.cellView = _oldMouseCell;
                newE.newCellView = _currentMouseCell;
                mapView.dispatchEvent(newE);
            }
            _oldMouseCell = _currentMouseCell;
            if (Boolean(_currentMouseCell)){
                var newE = new createjs.Event(gg.ViewEvents.CELL_MOUSE_OVER);
                newE.cellView = _currentMouseCell;
                mapView.dispatchEvent(newE);
            }

        }, 50);

        mapView.mapStage.on('click', function(e){
            if (e.nativeEvent.button == 1){
                return;
            }
            var cellView = mapView.getCellViewUnder(e.stageX, e.stageY);
            if (!Boolean(cellView)){
                return;
            }
            if (e.nativeEvent.button == 2){
                var newE = new createjs.Event(gg.ViewEvents.CELL_MOUSE_OPEN_CONTEXT);
                newE.cellView = cellView;
                mapView.dispatchEvent(newE);
            }
            if (e.nativeEvent.button == 0){
                if (!mapView.targetedCell.equals(cellView.viewData.coords) && !mapView.selectedCell.equals(cellView.viewData.coords)){
                    mapView.targetedCell = cellView.viewData.coords;
                    var newE = new createjs.Event(gg.ViewEvents.CELL_MOUSE_CHANGE_TARGET);
                    newE.cellView = cellView;
                    mapView.dispatchEvent(newE);
                }
            }
        });

        // mapView events
        mapView.on(gg.ViewEvents.CELL_MOUSE_OPEN_CONTEXT, function(e){
        });

        var targetCursor = mapView.mapStage.mapContainer.mapCursorContainer.targetCursor;
        mapView.on(gg.ViewEvents.CELL_MOUSE_CHANGE_TARGET, function(e){
//            console.log(e);
            var point = e.cellView.localToLocal(gg.Config.CELL_SIZE_HALF, gg.Config.CELL_SIZE_HALF, mapView.mapStage.mapContainer);
            targetCursor.x = point.x;
            targetCursor.y = point.y;
        });

        var overCursor = mapView.mapStage.mapContainer.mapCursorContainer.selectCursor;
        mapView.on(gg.ViewEvents.CELL_MOUSE_OVER , function(e){
//            console.log(e);
            var point = e.cellView.localToLocal(gg.Config.CELL_SIZE_HALF, gg.Config.CELL_SIZE_HALF, mapView.mapStage.mapContainer);
            overCursor.x = point.x;
            overCursor.y = point.y;
        });
        mapView.on(gg.ViewEvents.CELL_MOUSE_OUT , function(e){
            if (e.newCellView == null){
                overCursor.x = 0;
                overCursor.y = -1000;
            }
        });

        // window events
        jQuery(window).keydown(function(e){
            var mapContainer = mapView.mapStage.mapContainer;
            var STEP = 8;
            if(e.which === 40){
                mapContainer.y -= STEP;
            }else if(e.which === 38){
                mapContainer.y += STEP;
            }else if(e.which === 39){
                mapContainer.x -= STEP;
            }else if(e.which === 37){
                mapContainer.x += STEP;
            }
        });

        createjs.Ticker.addEventListener("tick", mapView.mapStage);
        createjs.Ticker.setFPS(50);
    }

    // get cell by position on map
    p.getCellView = function(x,y){
        return this.mapStage.mapContainer.terrainContainer.grid.cellsMatrix[x][y];
    }

    // get cell under mouse
    p.getCellViewUnder = function(x,y){
        var point = this.mapStage.mapContainer.terrainContainer.grid.globalToLocal(x, y);
        var coords = new createjs.Point(
            Math.floor(point.x / gg.Config.CELL_SIZE) +1,
            Math.floor(point.y / gg.Config.CELL_SIZE) +1
        );
        if (coords.x <=0 || coords.y <= 0){
            return null;
        }

        return this.getCellView(coords.x, coords.y);
    }

    gg.MapView = MapView;
})();