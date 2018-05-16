var CryptoJS = require("crypto-js");
var request = require('request');

var ACCESS_TOKEN = process.env.access_token || 'ZtWsDxzfTTkGnnsjp8yC';
var SECRET = process.env.SECRET_key_ff || 'V_-es-3JD82YyiNdzot7';

module.exports = {




    createCustomer: function(name, phone, address, email, callback){

        var params = {
            name: name,
            address: address,
            phone: phone,
            email: email,
            timestamp: Date.now(),
            access_token: ACCESS_TOKEN
        };

        sendRequestToBringg(params, 'customers', callback);
    },
    createTask: function(customer, title, note, callback){

        var task = {
            company_id: customer.company_id,
            customer_id: customer.id,
            title: title,
            address: customer.address,
            "lat": 12.9715987,
            "lng": 77.5945627,
            "note": note,
            scheduled_at: Date.now(),
            timestamp: Date.now(),
            access_token: ACCESS_TOKEN
        };
        sendRequestToBringg(task, 'tasks', callback);


    }

};

function makeQueryParams(params){

    var query_params = '';
    for (var key in params) {
        var value = params[key];
        if (query_params.length > 0) {
            query_params += '&';
        }
        query_params += key + '=' + encodeURIComponent(value);
    }
    return query_params;
}
function sendRequestToBringg(params, route, callback){
    let query_url = makeQueryParams(params);

    params.signature = CryptoJS.HmacSHA1(query_url, SECRET).toString();

    console.log('runnning post to Bringg');

    console.log(JSON.stringify(params));
    request.post({
        headers: {'Content-type': 'application/json'},
        url: 'https://developer-api.bringg.com/partner_api/' + route,
        body: JSON.stringify(params)
    }, function (error, response, body){
        if(error){
            console.log('error %j', error);
        }
        console.log('response: ', body);
        callback(error, response, body);
    });


};