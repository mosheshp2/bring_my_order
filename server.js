var app = require('express')();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');


var dataStore = require('./data_store');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


app.post('/api/order', function (req, res) {

    let name = req.query.name;
    let cellNumber = req.query.number;
    let address = req.query.address;
    let details = req.query.details || '';

    if(!name || !cellNumber || ! address) {
        return res.status(500).send('Please specify the following details: name, number, and address for pickup.');
    }

    let order_id = dataStore.saveOrder(name, cellNumber, address, details);

    res.send(`Order: ${order_id} saved.`);
});


app.use(bodyParser.text());

app.listen(port, function(){
    console.log('listening on *:' + port);
});
