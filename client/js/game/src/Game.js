// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var Game = function(options){
        var game = this;
        game.options = options;
        game.view.mapView = new gg.MapView(options);
    }

    var p = Game.prototype;

    p.view = {};
    p.model = {};

    gg.Game = Game;
})();