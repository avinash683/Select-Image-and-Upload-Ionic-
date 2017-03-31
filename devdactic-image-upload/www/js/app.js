// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  .controller('ImageCtrl', function ($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {
    $scope.image = null;

    $scope.showAlert = function(title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
    };

    // The rest of the app comes in here
    // Present Actionsheet for switch beteen Camera / Library
    $scope.loadImage = function() {
      var options = {
        title: 'Select Image Source',
        buttonLabels: ['Load from Library', 'Use Camera'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
      };
      $cordovaActionSheet.show(options).then(function(btnIndex) {
        var type = null;
        if (btnIndex === 1) {
          type = Camera.PictureSourceType.PHOTOLIBRARY;
        } else if (btnIndex === 2) {
          type = Camera.PictureSourceType.CAMERA;
        }
        if (type !== null) {
          $scope.selectPicture(type);
        }
      });
    };
    // Take image with the camera or from library and store it inside the app folder
// Image will not be saved to users Library.
    $scope.selectPicture = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imagePath) {
          // Grab the file name of the photo in the temporary directory
          var currentName = imagePath.replace(/^.*[\\\/]/, '');

          //Create a new name for the photo
          var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";

          // If you are trying to load image from the gallery on Android we need special treatment!
          if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
            window.FilePath.resolveNativePath(imagePath, function(entry) {
                window.resolveLocalFileSystemURL(entry, success, fail);
                function fail(e) {
                  console.error('Error: ', e);
                }

                function success(fileEntry) {
                  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                  // Only copy because of access rights
                  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                    $scope.image = newFileName;
                  }, function(error){
                    $scope.showAlert('Error', error.exception);
                  });
                };
              }
            );
          } else {
            var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // Move the file to permanent storage
            $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          }
        },
        function(err){
          // Not always an error, maybe cancel was pressed...
        })
    };

    // Returns the local path inside the app for an image
    $scope.pathForImage = function(image) {
      if (image === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + image;
      }
    };

    $scope.uploadImage = function() {
      // Destination URL
      var url = 'https://api.cloudinary.com/v1_1/pravindagde/image/upload';

      // File for Upload
      var targetPath = $scope.pathForImage($scope.image);

      // File name only
      var filename = $scope.image;

      var options = {
        params : {
          upload_preset: 'pxt0b1sk',
          fileKey: "file",
          fileName: filename,
          params : {'fileName': filename}
        }
      };
      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
        $scope.showAlert('Success','Image Upload Finished');
        console.log("SUCCESS: " + JSON.stringify(result));

      }, function(err) {
        $scope.showAlert('Error','Image Upload Failed');
        console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        console.log(progress)
      });
    };
/*$scope.ImageUploadsArray = function (){
  var myimages = ['{}','{}','{}'];
  $(document).on("upload",".uploadImage",function(){
    for(var  i = 0; len =  filename.length;i++){
      ("namePath").attr("src",myimages[i]);
    }
  })
}*/



  });
