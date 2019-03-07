/* global $ */
/* global sendRequest */
/* global item */
/* global strings */

const order = {
    create: {
        empty(){
            sendRequest('/order/new', {}, 
            (emptyOrder) => {order.create.container(emptyOrder._id); });
        },
        container(orderId, itemsQuantity=4){
            const div = `<div id='${orderId}' class='order flex-column'></div>`;     
            $("#order-display").prepend(div);
            order.create.topPanel(orderId);
            order.create.labelsContainer(orderId); 
            order.create.bottomPanel(orderId);
            order.create.itemContainer(orderId, itemsQuantity);
            $(`#${orderId}.order`).css("order", 0);
            window.location.href = `#${orderId}`;
        },
        topPanel(orderId){
            const   topPanelDiv = `<div class="top-panel flex"></div>`;
            $(`#${orderId}.order`).append(topPanelDiv);
            $(`#${orderId}.order .top-panel`).append(order.html.topPanel(orderId));
        },
        labelsContainer(orderId){
            const labelsDiv = `<div class="order-labels flex"></div>`;
            $(`#${orderId}.order`).append(labelsDiv);
            $(`#${orderId}.order .order-labels`).append(order.html.labels(orderId));
        },
        bottomPanel(orderId){
            const   bottomPanelContainer = `<div class="bottom-panel flex"></div>`;
            $(`#${orderId}.order`).append(bottomPanelContainer);
            $(`#${orderId}.order .bottom-panel`).append(order.html.bottomPanel(orderId));
        },
        itemContainer(orderId, itemsQuantity){
            const orderPanelDiv = `<div class='item-container'></div>`;
            $(`#${orderId}.order`).append(orderPanelDiv);
            for(var i=0; i<itemsQuantity; i++){ item.create.inside(orderId); }
        },
    },
    
    read: {
        findOpen(){
            sendRequest('/order/old', {}, (data) => { data.orders.forEach((openOrder, i) =>{ order.read.restore(openOrder, data.tableProperties[i]) }); });
        },
        restore(orderData, tableParameters){
            const promise = new Promise((resolve, reject) => {
                order.read.container(orderData._id, orderData.items);  
                resolve();        
            });
            promise.then( (resolve) => { order.read.values(orderData, tableParameters); });
        },
        values(orderData, tableParameters){
            $(`#${orderData._id}.order .table`)         .val(orderData.table);
            $(`#${orderData._id}.order .discount`)      .val(orderData.discount);
            $(`#${orderData._id}.order .table`)         .val(orderData.table);
            $(`#${orderData._id}.order .sum`)           .val(Number(orderData.sum).toFixed(2));
            $(`#${orderData._id}.order .discounted-sum`).val(Number(orderData.discountedSum).toFixed(2));
            $(`#${orderData._id}.order`).css('order', tableParameters.order);
            $(`#${orderData._id}.order .table`).css('background-color', tableParameters.color);
        },
        container(orderId, itemIds){
            //createOrderContainer(orderId, itemIds.length);
            //dis is like create order container
            
            const orderContainer = `<div id='${orderId}' class='order flex-column'></div>`;     
            $("#order-display").append(orderContainer);
            order.create.topPanel(orderId);
            order.create.labelsContainer(orderId); 
            order.create.bottomPanel(orderId);
            order.create.itemContainer(orderId);
            itemIds.forEach( itemId => { item.read.restore(orderId, itemId); });
        },
    },
    
    update: {
        close(orderID){
            sendRequest('/order/close', {_id: orderID}, (data) => { $(`#${data}.order`).remove(); });
        },
        table(){
            const orderId = $(this).parent().parent()[0].id;
            const tableValue = $(this).val();
            sendRequest('/order/edit/table', {_id: orderId, table: tableValue}, 
            (tableParameters) => {
                $(`#${orderId}.order`).css('order', tableParameters.order);
                $(`#${orderId}.order .table`).css('background-color', tableParameters.color);
                window.location.href = `#${orderId}`;
            });
        },
    
        sum(orderId){
            sendRequest('/order/edit/sum', { _id: orderId }, 
            (updatedOrder) => {$(`#${orderId}.order .sum`).val(Number(updatedOrder.sum).toFixed(2));});
        },
    
        discountedSum(orderId){
            sendRequest('/order/edit/discounted-sum', { _id: orderId }, 
            (updatedOrder) => {$(`#${orderId}.order .discounted-sum`).val(Number(updatedOrder.discountedSum).toFixed(2));});
        },
    
        discount(){
            const orderId = $(this).parent().parent()[0].id;
            sendRequest('/order/edit/discount', {_id: orderId, discount: $(this).val()}, 
            (data) => {
                $(`#${orderId}.order  .discounted-sum`).val(Number(data.discountedSum).toFixed(2)); 
                data.items.forEach((item) => 
                { $(`#${item._id}.item .discounted-price`).val(Number(item.discountedPrice).toFixed(2)); });    
            });
        },
    
        discountToGo(){
            const orderID = $(this).parent().parent().parent()[0].id;
            sendRequest('/order/edit/discount-togo', {_id: orderID, discountToGo: $(this).is(":checked")}, 
            (data) => {
                $(`#${orderID}.order .discounted-sum`).val(Number(data.discountedSum).toFixed(2)); 
                data.items.forEach((item) => 
                { $(`#${item._id}.item .discounted-price`).val(Number(item.discountedPrice).toFixed(2)); });
            });
        },
    


    },
    
    delete(orderId){
        sendRequest('/order/delete', {_id: orderId}, (res) => { $(`#${orderId}.order`).remove(); });
    },
    
    manage: { 
        checkIfAllInputsUsed(orderId){
            var items = $(`#${orderId}.order .item .name`);
            for(var i=0; i< items.length; i++){
                if($(items[i]).val() == ""){ return false; }
            }
            return true;
        },
        collapseItems(orderId){
            $(`#${orderId}.order .item-container`).toggleClass('hidden');
            $(`#${orderId}.order .order-labels`).toggleClass('hidden');
            if($(`#${orderId}.order .item-container`).hasClass('hidden')){
                $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-down"></i> Pokaż zamówienie <i class="fas fa-angle-down"></i>');
                $(`#${orderId}.order .table`).on("click", (event) => {order.manage.collapseItems($(event.target).parent().parent()[0].id)});
            
            } else {
                $(`#${orderId}.order .table`).off("click");
                $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-up"></i> Zwiń zamówienie <i class="fas fa-angle-up"></i>');
             
            }
        }
    },
    
    html:  {
        topPanel(orderId){
            const icons = {
                angleUp: `<i class="fas fa-angle-up"></i>`,
                pencil: `<i class="fas fa-pencil-alt"></i>`,
            };
            const   tableInput              = `<input type='text' class='table' placeholder='${strings.table}'>`,
                    discountInput           = `<input type='text' class='discount-label' value='${strings.discount}:'readonly><input type='number' class='discount' value='0' min='0' max='100' step='5'>`,
                    percentLabel            = `<input class='percent' type='text' value='%' readonly>`,
                    discountToGoCheckbox    = `<label class='to-go-button'><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>${strings.toGo}</label>`,
                    sendButton              = `<button onclick='order.update.close("${orderId}")'       class='send-button'      >${strings.closeOrder} ${icons.pencil}</button>`,
                    collapseButton          = `<button onclick='order.manage.collapseItems("${orderId}")'    class='collapse-order'>${icons.angleUp} ${strings.collapseOrder} ${icons.angleUp}</button>`;
            return [tableInput, collapseButton, discountInput, discountToGoCheckbox, percentLabel, sendButton, ];
        },
        
        labels(orderId){
            const plus = `<i class="fas fa-plus"></i>`;
            const   addItemButton           = `<button onclick='item.create.inside("${orderId}")' class='add-item-button'  >${plus}</button>`,
                    labelCode               = `<input type='text' class='register-code'     value='${strings.code}'         readonly>`,
                    labelName               = `<input type='text' class='name'              value='${strings.name}'       readonly>`,
                    labelType               = `<input type='text' class='type'              value='${strings.type}'         readonly>`,
                    labelQuantity           = `<input type='text' class='quantity'          value='${strings.quantity}'       readonly>`,
                    labelPrice              = `<input type='text' class='price'             value='${strings.price}'        readonly>`,
                    labelHint               = `<input type='text' class='hint'              value='${strings.hints}'       readonly>`,
                    labelDiscountedPrice    = `<input type='text' class='discounted-price'  value='${strings.discounted}'   readonly>`;
            return [addItemButton, labelCode, labelName, labelType, labelQuantity, labelPrice, labelHint, labelDiscountedPrice, ];
        },
        
        bottomPanel(orderId){
            const   dumpster = `<i class="fas fa-dumpster"></i>`;
            const   deleteButton        = `<button class='delete-button' onclick='order.delete("${orderId}")'>${dumpster} ${strings.deleteOrder} ${dumpster}</button>`,  
                    sumLabel            = `<input type='text'   class='sum-label'               value='${strings.sum}'            readonly>`,
                    sumInput            = `<input type='number' class='sum'                     value='0'               readonly>`,
                    discountedSumLabel  = `<input type='text'   class='discounted-sum-label'    value='${strings.discountedSum}'  readonly>`,
                    discountedSumInput  = `<input type='number' class='discounted-sum'          value='0'               readonly>`;
            return [deleteButton, sumLabel, sumInput, discountedSumLabel, discountedSumInput, ];
        },
    },
};