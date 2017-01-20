angular.module('saveTokenModule', [])
    .service('saveTokenService', function($http, $q, $ionicLoading) {
        var baseUrl = 'http://localhost:3000';

        this.register = function(deviceToken) {

            var deferred = $q.defer();
            $ionicLoading.show();

            /* $http.post(baseUrl + '/register', {'deviceToken': device_token})
                 .success(function(response){

                     $ionicLoading.hide();
                     deferred.resolve(response);

                 })
                 .error(function(data){
                     deferred.reject();
                 });*/

            console.log('Send the token to the server');

            $ionicLoading.hide();

            return;
        };
    });
