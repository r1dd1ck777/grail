// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var MapCell = function(cellData){
        var CELL_SIZE = 20;
        var cell = this;
        cell.initialize();
        cell.cellData = cellData;

        cell.v = new createjs.Shape();
        cell.v.x = cell.cellData.cX * CELL_SIZE;
        cell.v.y = cell.cellData.cY * CELL_SIZE;
        cell.v.graphics.beginFill("green").r(0,0,CELL_SIZE,CELL_SIZE);
    }
    var p = MapCell.prototype = new gg.ViewObject();

    gg.MapCell = MapCell;
})();