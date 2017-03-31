// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
  .controller('MediaCtrl', function($scope, $scope.$ionicModal) {
    $scope.allImages = [{
      'src': 'img/pic1.jpg'
    }, {
      'src': 'img/pic2.jpg'
    }, {
      'src': 'img/pic3.jpg'
    }];
  });
$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
};


$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
};


// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};
$scope.clipSrc = 'img/coffee.MOV';

$scope.playVideo = function() {
  $scope.showModal('templates/video-popover.html');
};

