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
            email: email
        };

        sendPostRequestToBringg(params, 'customers', callback);
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
            scheduled_at: Date.now()
        };
        sendPostRequestToBringg(task, 'tasks', callback);


    },
    getTasks: function (company, page, callback) {
        var params = {
            company_id: company,
            page: page
        };

        sendGetRequestToBringg(params, 'tasks', callback);
    }

};

function objToUrlquery(params){
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

function addSignature(params){
    params.access_token = ACCESS_TOKEN;
    params.timestamp = Date.now();

    let query_params = objToUrlquery(params);

    params.signature = CryptoJS.HmacSHA1(query_params, SECRET).toString();
    return params;
}
function sendPostRequestToBringg(params, route, callback){
    params = addSignature(params);

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
function sendGetRequestToBringg(params, route, callback){
    params = addSignature(params);

    console.log('runnning get to Bringg');

    console.log(JSON.stringify(params));
    request.get({
        headers: {'Content-type': 'application/json'},
        url: `https://developer-api.bringg.com/partner_api/${route}?${objToUrlquery(params)}`
    }, function (error, response, body){
        if(error){
            console.log('error %j', error);
        }
        console.log('response: ', body);
        callback(error, response, body);
    });

};