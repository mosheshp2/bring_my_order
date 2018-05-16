
var orders = [];

module.exports = {
    saveOrder: function(name, cellNum, address, details){

        orders = orders || [];
        let myOrder = {
            order_id: orders.length,
            name: name,
            cellNum: cellNum,
            address: address,
            details: details
        };

        orders.push(myOrder);

        return myOrder.order_id;
    }
};