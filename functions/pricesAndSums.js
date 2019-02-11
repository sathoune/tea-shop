function calculateSum(orderedItems, property="price"){
    var sum = 0; 
    orderedItems.forEach( (item) => { if(item[property]){ sum+=Number(item[property]); } });
    return sum.toString();
}

function calculateDiscountedPricesForOrder(orderedItems, order, OrderedItem){
    var discountedSum = 0;
    orderedItems.forEach(function(item){
        var newPrice = item.price * calculateDiscount(item, order);
        discountedSum += newPrice;
        OrderedItem.findOneAndUpdate({_id: item._id}, {discountedPrice: newPrice});
    });
    return discountedSum; 
}

function calculatePrice(menuObject, uiObject){
    var type = uiObject.type;
    var calculatedPrice;
    if(type == "sztuka" || type == "czajnik"){  calculatedPrice = menuObject.prices.default; }
    else if(type == "gaiwan"){                  calculatedPrice = menuObject.prices.gaiwan; }
    else if(type == "opakowanie"){              calculatedPrice = menuObject.prices.package; }
    else if(type == "gram"){                    calculatedPrice = menuObject.prices.bulk; }
    return calculatedPrice * uiObject.quantity;
}

function calculateDiscount(orderedItem, order){
    var type = orderedItem.type;
    if(!(type =='opakowanie' || type == 'gram')){ return (100-order.discount)*0.01; } 
    else{ 
        if(order.discountToGo){ return (100-order.discount)*0.01; } 
        else { return 1; }
    }
}

module.exports = {
    calculateSum: calculateSum,
    calculatePrice: calculatePrice,
    calculateDiscount: calculateDiscount,
    calculateDiscountedPricesForOrder: calculateDiscountedPricesForOrder,
};