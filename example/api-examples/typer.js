
var pizzapi = require('../../dominos');
var Address = require('../../src/Address');
var Customer = require('../../src/Customer');
var Order = require('../../src/Order');
var Item = require('../../src/Item');


module.exports.findStore = function(){
	pizzapi.Util.findNearbyStores(
	    '02467',
	    'Delivery',
	    function(storeData){
	    	var store =  new pizzapi.Store(
	            {
	                ID: storeData.result.Stores[0].StoreID
	            }
	        );
	        console.log(store);
	    }
	);
}
module.exports.getMenu = function(x){
 var store =  new pizzapi.Store(
	            {
	                ID: 3745
	            });
 store.getMenu(function(menu) {
            function printCategory(showItems,category,depth) {
                if (!depth) depth = 0;
                var indent = Array(depth+1).join("  ");
                console.log(indent+category.getName());
                for (var subIndex in category.getSubcategories()) {
                    printCategory(showItems,category.getSubcategories()[subIndex],depth+1);
                }
                if (showItems) {
                    category.getProducts().forEach(function(product) {
                        console.log(indent+"  ["+product.getCode()+"] "+product.getName());
                    });
                }
            }
            console.log("************ Coupon Menu ************");
            printCategory(true,menu.getCouponCategory(),2);
            console.log("\n\n************ Preconfigured Menu ************");
            printCategory(true,menu.getPreconfiguredCategory(),1);
            console.log("\n\n************ Regular Menu ************");
            printCategory(true,menu.getFoodCategory(),1);
        });
}

module.exports.createCustomer= function(){
	var jsonAddress = new Address({
		Street: '140 Commonwealth Ave', 
		City: 'Chestnut Hill', 
		Region: "MA", 
		PostalCode: 02467
	})
	var customer = new Customer({
	address: jsonAddress, 
	firstName: 'Emily', 
	lastName: 'Lu', 
	phone: '6102030730', 
	email: 'luem@bc.edu'
	})
	return customer;
}

module.exports.createOrder = function(){
	var customer = module.exports.createCustomer(); 
	var order = new Order(
	{
		customer : customer, 
		storeId: "1605", 
		deliveryMethod: 'Delivery'
	})
	order.addItem (new Item({
		code: '14SCREEN', 
		options: '', 
		quantity: 1
	})
	)
	console.log(order)
	order.validate(
    	function(result) {
        	console.log("We did it!");
      	}
  );
	return order; 

}
module.exports.checkOut = function() {
	var order = module.exports.createOrder();
	var cardNumber = '4256280014584966'; 
	var cardInfo = new order.PaymentObject();
	cardInfo.Amount = order.price;
	cardInfo.Number = cardNumber; 
	cardInfo.Expiration = '0919'
	cardInfo.SecurityCode = '168', 
	cardInfo.PostalCode = '19010'
	order.Payments.push(cardInfo); 

	order.place(
		function(result) { 
			console.log("order placed!")})
}	// var cardNumber = '422'

