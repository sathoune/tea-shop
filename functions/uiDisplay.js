function positionTable(tableValue){
    const tableColors = {
        morocco:    "#4ebbff",
        oriental:   "#eb842a",
        colonial:   "#ff5145",
        outside:    "#2ab015",
        scene:      "#e00007",
        other:      "#fcd912",
    }
    const parameters = {
        order: 0,
        color: "silver",
    }
    if(tableValue==''){
        parameters.order = 0;
    }
    else if('m' == tableValue){
        parameters.order = 8;
        parameters.color = tableColors.morocco;
    }
    else if('m1' == tableValue){
        parameters.order = 10;
        parameters.color = tableColors.morocco;
    }
    else if('m2' == tableValue){
        parameters.order = 12;
        parameters.color = tableColors.morocco;
    }
    else if('m3' ==tableValue){
        parameters.order = 14;
        parameters.color = tableColors.morocco;
    }
    else if('m4' == tableValue){
        parameters.order = 16;
        parameters.color = tableColors.morocco;
    }
    else if('k' == tableValue){
        parameters.order = 18;
        parameters.color = tableColors.colonial;
    }
    else if('k1' == tableValue){
        parameters.order = 20;
        parameters.color = tableColors.colonial;
    }
    else if('k2' == tableValue){
        parameters.order = 22;
        parameters.color = tableColors.colonial;
    }
    else if('k3' == tableValue){
        parameters.order = 24;
        parameters.color = tableColors.colonial;
    }
    else if('t' == tableValue || 'taj' == tableValue || 'tadz' == tableValue){
        parameters.order = 26;
        parameters.color = tableColors.scene;
    }
    else if('k4' == tableValue){
        parameters.order = 28;
        parameters.color = tableColors.colonial;
    }
    else if('k5' == tableValue){
        parameters.order = 30;
        parameters.color = tableColors.colonial;
    }
    else if('k6' == tableValue){
        parameters.order = 32;
        parameters.color = tableColors.colonial;
    } 
    else if('o' == tableValue){
        parameters.order = 38;
        parameters.color = tableColors.oriental;
    }
    else if('o1' == tableValue){
        parameters.order = 40;
        parameters.color = tableColors.oriental;
    }
    else if('o2' == tableValue){
        parameters.order = 42;
        parameters.color = tableColors.oriental;
    }
    else if('o3' == tableValue){
        parameters.order = 44;
        parameters.color = tableColors.oriental;
    }
    else if(/out./.test(tableValue)){
        parameters.order = 8;
        parameters.color = tableColors.outside;
    }
    else{
        parameters.order = 5;
        parameters.color = tableColors.other;
    }
    return parameters;
}

module.exports = {
    positionTable,
};