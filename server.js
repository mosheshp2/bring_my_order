var app = require('express')();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');


var dataStore = require('./data_store');
var bringgApi = require('./bringg_api');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


app.post('/api/order', function (req, res) {

    let name = req.query.name;
    let cellNumber = req.query.number;
    let address = req.query.address;
    let email = req.query.email || '';
    let details = req.query.details || '';
    let title = req.query.title || '';
    let note = req.query.note || '';

    if(!name || !cellNumber || ! address) {
        return res.status(500).send('Please specify the following details: name, number, and address for pickup.');
    }

    let order_id = dataStore.saveOrder(name, cellNumber, address, details);

    bringgApi.createCustomer(name, cellNumber, address, email,
        function(err, response, data) {
            if(err){
                return res.status(500).send(err);
            }
            bringgApi.createTask(JSON.parse(data).customer, title, note, function(error2, resp, data2) {
                if(error2){
                    return res.status(500).send(error2);
                }
                res.send(data2);

            } );


        });

});

app.get('/api/tasks', function(req, res){

    var company = req.query.company || 11010,
        page = req.query.page || 1;
    bringgApi.getTasks(company, page, function(error, resp, data){
        if(error){
            return res.status(500).send(error);
        }
        res.send(data);


    });

});

app.use(bodyParser.text());

app.listen(port, function(){
    console.log('listening on *:' + port);
});
