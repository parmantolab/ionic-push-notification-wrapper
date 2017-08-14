//Server settings for android push notifications with node-gcm

// Load modules
var express = require('express');
var gcm = require('node-gcm');

// The apiKey of your project on FCM
var app = express();
//var apiKey = "AAAAjo8JDg0:APA91bEkbzZbEgR7eXY1jKgmJZhoW3GaNmRYf5yICNQQEOcaHxZuYtOKLNSK98T9aFAiUpkLUukldgsYDPBvVcEWEabVnQeKyBGWWM-O7yrrufGe2N-40x4I07WLvveL8O3dzDAKKKM7";
// var apiKey = "AAAA7qUjTrg:APA91bFW2oVQ1mE9u2ANPjFy8IfkMWVGrHs0f1b1Umd_K1DDfng9h0e0hRQih8mLaXCPvu35xHBq9recmJ1EGJiCk7o2qwdN2n3FYPwHr21_p4iP2z1mgZGDdZo-uFLGrRxpqXM5L_tRvudTQJTxxH2IpQC0VquYPQ";

//iadapt
var apiKey = "AAAAjo8JDg0:APA91bEkbzZbEgR7eXY1jKgmJZhoW3GaNmRYf5yICNQQEOcaHxZuYtOKLNSK98T9aFAiUpkLUukldgsYDPBvVcEWEabVnQeKyBGWWM-O7yrrufGe2N-40x4I07WLvveL8O3dzDAKKKM7";

//Set up the server
var server = app.listen(3000, function() {
    console.log('server is just fine!');
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Define the basic route
app.get('/', function(req, res) {
    res.send("This is basic route");
});

app.post('/register', function(req, res) {
    var device_token;
    device_token = req.body.device_token;
    console.log('device token received');
    console.log(device_token);
    res.send('ok');
});

app.get('/push', function(req, res) {
    //Initialize the service
    var service = new gcm.Sender(apiKey);
    //the number of times to retry sending the message if it fails
    var retry_times = 4;

    /***** Define the message for Android Devices   *****/
    var message_Android = new gcm.Message();
    //The title will be shown in the notification center
    message_Android.addData('title', 'Hello, World');

    message_Android.addData('message', 'This is a notification that will be displayed ASAP.');

    //Add action buttons, set the foreground property to true the app will be brought to the front
    //if foreground is false then the callback is run without the app being brought to the foreground.
    message_Android.addData('actions', [
        { "icon": "accept", "title": "Accept", "callback": "window.accept", "foreground": true },
        { "icon": "reject", "title": "Reject", "callback": "window.reject", "foreground": false },
    ]);

    //Set content-available = 1, the on('notification') event handler will be called
    //even app running in background or closed
    message_Android.addData('content-available', '1');

    //Give every message a unique id
    message_Android.addData('notId', Math.ceil(Math.random() * 100));

    //priority can be: -2: minimum, -1: low, 0: default , 1: high, 2: maximum priority.
    //Set priority will inform the user on the screen even though in the background or close the app.
    //This priority value determines where the push notification will be put in the notification shade.
    message_Android.addData('priority', 1);

/*    message_Android.addData('style', 'inbox');
    message_Android.addData('summaryText', 'There are %n% notifications');*/

    message_Android.addData('data', { 'type': 'New Medicine', 'id': 1112 });


    /***** Define the message for IOS Devices   *****/
    // var message_IOS = new gcm.Message({
    //     contentAvailable: true,
    //     // priority: 'high',
    //     notification: {
    //         "sound": "default",
    //         "icon": "default",
    //         title: "Hello, World",
    //         body: 'This is a notification that will be displayed ASAP.',
    //         'click-action': 'invite'
    //     },

    //     //Add additional data to the payload
    //     data: {
    //         'type': 'New Medicine',
    //         'data': 1112,
    //         notId: Math.random() * 100,
    //     }
    // });


    // var payload = {
    //     // 'content_available': true,
    //     // 'prioriry': 'high',
    //     // notification: {
    //     //     'title': 'Hellow world notif',
    //     //     'body': 'Notification Body for both IOS and Android'
    //     // },
    //     data: {
    //         'content-available': '1',
    //         'priority': 1,
    //         'title': 'Hellow world data',
    //         'message': 'Notification Message for both IOS and Android',
    //         // 'icon': 'default',
    //         // 'sound': 'default',
    //         'notId': Math.random() * 100,
    //         // 'actions': [
    //         //     { "icon": "accept", "title": "Accept", "callback": "window.accept", "foreground": true },
    //         //     { "icon": "reject", "title": "Reject", "callback": "window.reject", "foreground": false },
    //         // ],
    //         'data': {
    //             'type': 'TEST'
    //         }
    //     }
    // }

    // //for android
    payload = {
        "data": {
            'priority': 1,
            "content-available": "1",
            "notId": Math.random() * 100,
            "data": "{\n  \"timestamp\" : \"2017-04-14T23:37:12Z\",\n  \"content\" : \"{\\n  \\\"id\\\" : 8\\n}\",\n  \"type\" : \"update_goal\"\n}",
            "title": "Update goal",
            "message": "Goal was updated"
        }
    }



    var message = new gcm.Message(payload); //console.log(message, message.toJson(), message_Android.toJson());
    //Here get the devices from your database into an array
    var deviceID_Android = "es9CSkHH6GM:APA91bH2o9_kSiV0Lv4cu5lTS30nYlHc6XzwiFqm8uFr8U8OVT7jn1Y2nGbDODDUE9P4LPwlVZxUuUhAYlRC5sUQDy2A6GJQz7emiF_1NY82QTiDczWzqJ2VaKhfiqZf8ha6M7BcCik0";
    //var deviceID_Android = "m3kHS4BnrF0:APA91bGDRjNibKqDkMooSmaQlO2xVTE3D1FvmNzqttO6l_yeLCQwztRv3FY-R92T3En-3TdwH403c_4Dr7qMPL-l6PAG10-_E7pOkUhGgZXOImuYbvl29mDcwZI-WIwzUGpQUUTIzaf3";

    // var deviceID_IOS = "nO19ipNbiYU:APA91bGkIiKA57BXw_IpI2rT9_gnFag3-1cbiNHDavS9N1MKqo4rk7E-oKhkp5ej--9WVtqugVolC4C6YrCOC1-3y99Q6LbbBTlrQMv36vnNKR1yUiLXi_7zvJPrhGILxbS-4DF831gN";
    var deviceID_IOS = "mFtMmQH2nJs:APA91bEL6oNDbMYtJZfGInMBnBLzZ_rACEb_07BAugaDx8t68Hl8AnKIYsHw_mC23gxtcStHIvavlEEXz-HqcgGwJ_NIrMLY7HdtY6Fs0SZaw8ThWHO_n9i_UGnSo4BnrdN98BX4sVor";

    /**** Send Notifications to Android devices   *****/
    console.log(message.toJson());
    service.send(message, { registrationTokens: [deviceID_Android] }, retry_times, function(err, response) {
        if (err)
            console.error(err);
        else
            console.log(response);
    });

    /**** Send Notifications to IOS devices   *****/
    // // for ios
    payload = {
        "notification": {
            "sound": "default",
            "icon": "default",
            "body": "Notify in Body",
            "title": "Title Notification"
        },
        "contentAvailable": true,
        "priority": "high",
        "data": {
            // "content-available": '1',
            // "priority": 1,
            "notId": Math.random() * 100,
            "data": "{\"type\" : \"update_goal\"\n}",
            "title": "Title Data",
            "message": "Message in Data"
        }
    }
    message = new gcm.Message(payload);
    console.log(message.toJson());
    service.send(message, { registrationTokens: [deviceID_IOS] }, retry_times, function(err, response) {
        if (err)
            console.error(err);
        else
            console.log(response);
    });
});
