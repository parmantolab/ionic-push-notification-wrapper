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
            var service = {};

            service.push = null;
            service.register = _register;
            service.unregister = _unregister;

            return service;
            ////////////////////////
            function _pluginReady() {                
                var status = window.PushNotification ? true : false;
                if (!status) {
                    console.error('PushNotification is not ready.');
                }

                return status;
            }
            function _register() {
                if (!_pluginReady()) return;

                this.push = PushNotification.init(options);
                this.push.on('registration', _onRegistration);
                this.push.on('notification', _onNotification);
            }

            function _unregister() {
                if (this.push) {
                    this.push.unregister(cbSuccess, cbFail, []);
                }

                //////
                function cbSuccess() {
                    this.push = null;
                }
                function cbFail() {}
            }

            function _onRegistration(data) {
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

                console.log("local" + window.localStorage.getItem('registrationId'));
            }

            function _onNotification(data) {
                //Broadcast the notification here
                $rootScope.$broadcast('onPushNotification', data.additionalData.data, data);

                // Call finish function to let the  OSknow the notification is done
                push.finish(function() {
                    console.log('processing of push data is finished');
                }, function() {
                    console.log('something went wrong with push.finish for ID = ' + data.additionalData.notId);
                }, data.additionalData.notId);
            }
        }
    });
