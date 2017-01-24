angular.module('pushModule', ['ionic'])
    .provider('PushService', function() {
        var self = this;

        //Set the default values of parameters
        this.parameters = {
            senderID: '',
            iosAlert: true,
            iosBadge: true,
            iosSound: true,
            iosCategories: {
                'invite': {
                    'yes': {
                        'callback': window.accept,
                        'title': 'Accept',
                        'foreground': true,
                        'destructive': false
                    },
                    'no': {
                        'callback': window.reject,
                        'title': 'Reject',
                        'foreground': false,
                        'destructive': false
                    }
                }
            }
        };

        this.setParameters = function(parameters) {
            self.parameters = angular.merge(self.parameters, parameters);
        };

        this.$get = pushService;
        pushService.$inject = ['$ionicPlatform', '$ionicPopup', '$rootScope'];

        function pushService($ionicPlatform, $ionicPopup, $rootScope) {
            $ionicPlatform.ready(function() {
                // After the platform is ready and our plugins are available
                //Intialize push service
                var push = PushNotification.init({
                    android: {
                        //senderId of your project on FCM
                        senderID: self.parameters.senderID
                    },
                    ios: {
                        //senderId of your project on FCM
                        senderID: self.parameters.senderID,
                        //Whether you allow alert, badge/ alert/ sound
                        alert: self.parameters.iosAlert,
                        badge: self.parameters.iosBadge,
                        sound: self.parameters.iosSound,
                        gcmSandbox: 'true',
                        //Define the buttons of notification:
                        categories: self.parameters.iosCategories
                    },
                    windows: {}
                });

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
                        console.log('something went wrong with push.finish for ID = ' + data.additionalData.notId);
                    }, data.additionalData.notId);
                });

                //Define the callback function of action buttons here.
                window.reject = function(data) {
                    window.alert('Reject Triggred');
                };

                window.accept = function(data) {
                    window.alert('Accept Triggred');
                };
            });
        }
    });
