
var troolyApp = angular.module('troolyApp',[]);

troolyApp.controller('troolyAppCtrl',['$scope','$sce','$http', function($scope,$sce, $http){

    $scope.urlToLoad = "http://www.troo.ly";

    $scope.phoneNumbersWithCount = [
    ];

    $scope.getPhoneNumbers = function(){
       $http({
        url: '/phoneNum', 
        method: "GET",
        params: {url: $scope.urlToLoad},

    }).then(function successCallback(response) {

        $scope.phoneNumbersWithCount = [];

        response.data.phoneNumbers.forEach(function(phNum) {

            if (phNum.length >= 10){

                var currentEntry = $scope.phoneNumbersWithCount.filter(function(obj) {return obj.number == phNum})[0];

                if (currentEntry) {
                    currentEntry.count += 1; 
                } else {
                    $scope.phoneNumbersWithCount.push({number:phNum, count:1});    
                    
                }

                
            }
        });
    }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
});
}


}]);