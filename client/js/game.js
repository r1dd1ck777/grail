'use strict';
// namespace:
this.gg = this.gg||{};

angular.module('grail-game', [])
    .factory('$game', [function(){
        var game = new gg.Game({
            mapCanvasId: 'map-canvas'
        });

        return game;
    }])
    .run(['$game', '$rootScope', function($game, $rootScope){
        var isOpenSellHelp = false;
        angular.element('body').on('contextmenu', function(e){
            return false;
        });
        $game.view.mapView.on(gg.ViewEvents.CELL_MOUSE_OPEN_CONTEXT, function(e){
            isOpenSellHelp = true;
            $rootScope.$broadcast(gg.ViewEvents.CELL_MOUSE_OPEN_CONTEXT);
        });
        angular.element('body').on('mouseup', function(e){
            if (!isOpenSellHelp){
                return;
            }
            isOpenSellHelp = false;
            $rootScope.$broadcast(gg.ViewEvents.CELL_MOUSE_CLOSE_CONTEXT);
        });
    }])
    .controller('grailGame', ['$scope', '$game', function($scope, $game){
        $scope.contextHelp = {
            isVisible: false
        }
        $scope.$on(gg.ViewEvents.CELL_MOUSE_OPEN_CONTEXT, function(e){
            $scope.$apply(function(){
                $scope.contextHelp.isVisible = true;
            });
        });
        $scope.$on(gg.ViewEvents.CELL_MOUSE_CLOSE_CONTEXT, function(e){
            $scope.$apply(function(){
                $scope.contextHelp.isVisible = false;
            });
        });
    }])
;

(function($){
    $(document).ready(function(){
        var loadQueue = new createjs.LoadQueue();
        loadQueue.on("complete", function(){
            gg.resources = loadQueue;
            angular.bootstrap($('html')[0], ['grail-game']);
        });
        loadQueue.loadManifest([
            {id: "grass", src:"images/terrain/grass.jpg"},
            {id: "sand", src:"images/terrain/sand.jpg"},
            {id: "snow", src:"images/terrain/snow.jpg"},
            {id: "anim_test_250", src:"images/anim_test_250.png"},
            {id: "target", src:"images/target.png"}
        ]);
    });
})(jQuery);

