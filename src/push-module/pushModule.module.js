angular.module('pushModule', ['ionic'])
    .provider('PushService', function() {
        var self = this;

        //Set the default values of parameters
        var options = {
            android: {
                //senderId of your project on FCM
                senderID: null,                
            },
            ios: {
                //senderId of your project on FCM
                senderID: null,
                gcmSandbox: false,

                //Whether you allow alert, badge/ alert/ sound
                alert: true,
                badge: true,
                sound: true                
            }
        };

        this.config = function(config) {
            angular.merge(options, config);
        }

        this.$get = pushService;
        pushService.$inject = ['$ionicPlatform', '$rootScope'];

        function pushService($ionicPlatform, $rootScope) {
            $ionicPlatform.ready(function() {
                // After the platform is ready and our plugins are available
                //Intialize push service
                var push = PushNotification.init(options);

                push.on('registration', function(data) {
                    //Get the old RegistrationID of this device
                    var oldRegId = window.localStorage.getItem('registrationId');

                    //Check whether this is a new device or
                    //the RegisterationId of this device changed because reinstalling
                    if (oldRegId !== data.registrationId) {
                        // Save new registrationID to localstorage
                        window.localStorage.setItem('registrationId', data.registrationId);

                        //If Id changed, broadcast the new registerationID to the app
                        $rootScope.$broadcast('onChangeRegistrationId', data.registrationId);
                    }

                    console.log(window.localStorage.getItem('registrationId'));
                });

                push.on('notification', function(data) {
                    //Broadcast the notification here
                    $rootScope.$broadcast('onPushNotification', data.additionalData.data, data);

                    // Call finish function to let the  OSknow the notification is done
                    push.finish(function() {
                        console.log('processing of push data is finished');
                    }, function() {
                        console.log('something went wrong with push.finish for ID = ' + data.additionalData.id);
                    }, data.additionalData.id);
                });
            });
        }
    });
