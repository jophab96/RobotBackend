


self.addEventListener('message', function(e) {
    doPostRequest();
    var message = "READY";
    self.postMessage(message);
    self.close();

});


function doPostRequest() {


    var jsonDataObj = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'trigger_gripper_release',
        'params': [{'activation_timeout': 5}]
    };

    request.post({
        headers: {
            'user': 'intern',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
        },
        url: 'http://localhost:4000',
        body: jsonData,
        json: true
    }, function (error, response, body) {
        console.log(body);
    });


    /**
     var options = {
        url: 'http://localhost:4000',
        headers: {
            'User-Agent': 'request'
        }
    };

     var text ={ json: {
            jsonrpc: "2.0",
            id: "1",
            method: "trigger_gripper_release",
            params: [{activation_timeout : 5}]
        }};


     function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info);

        }else{

            console.log(error);

        }
    }

     request.post(options, callback);
     **/
    /**
     request.post(
     adress,
     { json: {
                jsonrpc: "2.0",
                id: "1",
                method: "trigger_gripper_release",
                params: [{activation_timeout : 5}]
    }},
     function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }else{

                console.log(error);

            }
        }
     );

     **/

}


var request = require('request');
var adress = 'http://localhost:4000';
