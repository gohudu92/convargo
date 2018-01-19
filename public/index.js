'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
var truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
var deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];



function deductible(){
  for (var delivery in deliveries){
    if(deliveries[delivery].options.deductibleReduction == true){
      deliveries[delivery].price = deliveries[delivery].price + deliveries[delivery].volume;
    }
  }
}


function commission(){
  for (var delivery in deliveries){
    var deductible;
    var price;
    if(deliveries[delivery].options.deductibleReduction == true){
      deductible = deliveries[delivery].volume;
      price = deliveries[delivery].price - deductible;
    }
    else{
      deductible = 0;
      price = deliveries[delivery].price;
    }
    var commission = price*0.3;
    var insurance = commission*0.5;
    var treasury = Math.ceil(deliveries[delivery].distance / 500);
    var convargo = commission-(insurance+treasury) + deductible;
    deliveries[delivery].commission.insurance = insurance;
    deliveries[delivery].commission.treasury = treasury;
    deliveries[delivery].commission.convargo = convargo;
  }
}


function shippingPrices(){
  for (var delivery in deliveries){
    for (var truck in truckers){
      if(deliveries[delivery].truckerId == truckers[truck].id){
        var price = truckers[truck].pricePerKm*deliveries[delivery].distance;
        price = price + truckers[truck].pricePerVolume*deliveries[delivery].volume;
        deliveries[delivery].price = price;
      }
    }
  }
}

function decreasingPricesForHighVolume(){
  for (var delivery in deliveries){
    for (var truck in truckers){
      if(deliveries[delivery].truckerId == truckers[truck].id){
        var price = truckers[truck].pricePerKm*deliveries[delivery].distance;
        if(deliveries[delivery].volume > 25){
          price = price + truckers[truck].pricePerVolume*deliveries[delivery].volume*0.5;
          deliveries[delivery].price = price;
        }
        else if(deliveries[delivery].volume > 10){
          price = price + truckers[truck].pricePerVolume*deliveries[delivery].volume*0.7;
          deliveries[delivery].price = price;
        }
        else if(deliveries[delivery].volume > 5){
          price = price + truckers[truck].pricePerVolume*deliveries[delivery].volume*0.9;
          deliveries[delivery].price = price;
        }
        else{
          price = price + truckers[truck].pricePerVolume*deliveries[delivery].volume;
          deliveries[delivery].price = price;
        }
      }
    }
  }
}

decreasingPricesForHighVolume();
commission();
deductible();



//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

function theActors(){
  for (var actor in actors){
    for (var delivery in deliveries){
      if(deliveries[delivery].id == actors[actor].deliveryId){
        for (var dif in actors[actor].payment){
          if(actors[actor].payment[dif].who == "shipper"){
            actors[actor].payment[dif].amount = deliveries[delivery].price;
          }
          else if(actors[actor].payment[dif].who == "trucker"){
            var deductible;
            var price;
            if(deliveries[delivery].options.deductibleReduction == true){
              deductible = deliveries[delivery].volume;
              price = deliveries[delivery].price - deductible;
            }
            else {
              deductible = 0;
              price = deliveries[delivery].price;
            }
            actors[actor].payment[dif].amount = price - (deliveries[delivery].commission.insurance + (deliveries[delivery].commission.convargo - deductible) + deliveries[delivery].commission.treasury);
          }
          else if(actors[actor].payment[dif].who == "insurance"){
            actors[actor].payment[dif].amount = deliveries[delivery].commission.insurance;
          }
          else if (actors[actor].payment[dif].who == "treasury"){
            actors[actor].payment[dif].amount = deliveries[delivery].commission.treasury;
          }
          else if (actors[actor].payment[dif].who == "convargo"){
            actors[actor].payment[dif].amount = deliveries[delivery].commission.convargo;
          }
        }
      }
    }
  }
}

theActors();




console.log(truckers);
console.log(deliveries);
console.log(actors);
