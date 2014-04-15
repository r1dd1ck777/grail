// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var Game = function(mapCanvasId){
        var game = this;
        game.view.mapView = new gg.MapView(mapCanvasId);
    }

    var p = Game.prototype;

    p.view = {};
    p.model = {};

    gg.Game = Game;
})();