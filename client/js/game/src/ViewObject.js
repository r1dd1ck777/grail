// namespace:
this.gg = this.gg||{};

(function() {
    "use strict";
    var ViewObject = function(){
        this.initialize();
    }
    var p = ViewObject.prototype = new createjs.EventDispatcher();

    gg.ViewObject = ViewObject;
})();