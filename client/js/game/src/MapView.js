// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapView = function(options){
        this.initialize(options);
    }
    var p = MapView.prototype = new createjs.EventDispatcher();
    p.EventDispatcher_initialize = p.initialize;
    p.mapStage = null
    p._selectedCell = null;
    p._targetedCell = null;
    p._pathFinder = null;
    p._mouseInterval = null;


    p.initialize = function(options){
        var mapView = this;
        mapView.EventDispatcher_initialize();
        mapView.options = options;
        mapView.mapStage = gg.MapViewUtils.createMapStage(mapView.options.mapCanvasId);
        mapView._initPathFinder();
        mapView._setSelected(0,0);
        mapView._setTargeted(1,1);

        // cell events
        var _currentMouseCell = null, _oldMouseCell = null;
        mapView._mouseInterval = setInterval(function(){
            _currentMouseCell = mapView._getCellViewUnder(mapView.mapStage.mouseX, mapView.mapStage.mouseY);
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
            if (e.nativeEvent.button != 0){
                return;
            }
            var cellView = mapView._getCellViewUnder(e.stageX, e.stageY);
            if (!Boolean(cellView)){
                return;
            }
            if (e.nativeEvent.button == 0){
                if (!mapView._targetedCell.equals(cellView.viewData.coords) && !mapView._selectedCell.equals(cellView.viewData.coords)){
                    var newE = new createjs.Event(gg.ViewEvents.CELL_MOUSE_CHANGE_TARGET);
                    newE.cellView = cellView;
                    mapView.dispatchEvent(newE);
                }
            }
        });

        mapView.mapStage.on('mousedown', function(e){
            if (e.nativeEvent.button != 2){
                return;
            }
            var cellView = mapView._getCellViewUnder(e.stageX, e.stageY);
            if (!Boolean(cellView)){
                return;
            }
            var newE = new createjs.Event(gg.ViewEvents.CELL_MOUSE_OPEN_CONTEXT);
            newE.cellView = cellView;
            mapView.dispatchEvent(newE);
        });

        // mapView events
        mapView.on(gg.ViewEvents.CELL_MOUSE_CHANGE_TARGET, function(e){
            mapView._setTargeted(e.cellView.viewData.coords.x, e.cellView.viewData.coords.y);
        });

        var overCursor = mapView.mapStage.mapContainer.mapCursorContainer.overCursor;
        mapView.on(gg.ViewEvents.CELL_MOUSE_OVER , function(e){
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
        createjs.Ticker.setFPS(24);
    }

    p._initPathFinder = function(){
        this._pathFinder = new gg.MapViewPathFinder(this._getCellsMatrix());
    }
    // get cell by position on map
    p._getCellView = function(x,y){
        return this.mapStage.mapContainer.terrainContainer.grid.cellsMatrix[x][y];
    }

    // get cell under mouse
    p._getCellViewUnder = function(x,y){
        var point = this.mapStage.mapContainer.terrainContainer.grid.globalToLocal(x, y);
        var coords = new createjs.Point(
            Math.floor(point.x / gg.Config.CELL_SIZE) +1,
            Math.floor(point.y / gg.Config.CELL_SIZE) +1
        );
        if (coords.x < 0 || coords.y < 0){
            return null;
        }

        return this._getCellView(coords.x, coords.y);
    }

    p._getCellViewCenter = function(x,y, target){
        return this._getCellView(x,y).localToLocal(gg.Config.CELL_SIZE_HALF, gg.Config.CELL_SIZE_HALF, target);
    }
    
    p._getCellsMatrix = function(){
        return this.mapStage.mapContainer.terrainContainer.grid.cellsMatrix
    }

    p._drawPathFlags = function(sX, sY, eX, eY){
        var mapView = this;
        var result = mapView._pathFinder.getPath(sX, sY, eX, eY);
        var mapFlagsContainer = mapView.mapStage.mapContainer.mapFlagsContainer;
        mapFlagsContainer.removeAllChildren();
        for (var k in result){
            var pos = mapView._getCellViewCenter(result[k].x, result[k].y, mapFlagsContainer);
            var flag = new createjs.Shape();
            flag.graphics.beginFill("blue").dc(0,0,2);
            flag.x = pos.x;
            flag.y = pos.y;
            mapFlagsContainer.addChild(flag);
            console.log(result[k].x, result[k].y);
        }
    }

    p._setTargeted = function(x,y){
        var cellView = this._getCellView(x,y);
        this._targetedCell = new createjs.Point(x,y);

        var targetCursor = this.mapStage.mapContainer.mapCursorContainer.targetCursor;
        var point = cellView.localToLocal(gg.Config.CELL_SIZE_HALF, gg.Config.CELL_SIZE_HALF, this.mapStage.mapContainer);
        targetCursor.x = point.x;
        targetCursor.y = point.y;

        this._drawPathFlags(this._selectedCell.x, this._selectedCell.y, x, y);
    }

    p._setSelected = function(x,y){
        var cellView = this._getCellView(x,y);
        this._selectedCell = new createjs.Point(x,y);

        var selectedCursor = this.mapStage.mapContainer.mapCursorContainer.selectCursor;
        var point = cellView.localToLocal(gg.Config.CELL_SIZE_HALF, gg.Config.CELL_SIZE_HALF, this.mapStage.mapContainer);
        selectedCursor.x = point.x;
        selectedCursor.y = point.y;
    }

    gg.MapView = MapView;
})();