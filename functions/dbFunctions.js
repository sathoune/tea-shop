function promiseToGetFromCollectionById(collection, id){
    let promise = new Promise( (resolve, reject) => {
        collection.findById({_id: id}, (err, found) => {
            if(err){ reject('3131'); console.log(err); }
            else { resolve(found); }
        }); 
    });
    return promise;
}

function promiseToDeleteFromCollectionById(collection, id){
    let promise = new Promise( (resolve, reject) => {
        collection.findOneAndDelete({_id: id}, (err) => {
            if(err){ reject(); console.log(err); }
            else { resolve('object deleted'); }
       }); 
    });
    return promise;
}

function promiseToUpdateFromCollectionById(collection, id, properties){
    let promise = new Promise( (resolve, reject) => {
        collection.findOneAndUpdate({_id: id}, properties, {new: true}, (err, updated) => {
            if(err){ reject(); console.log(err) }
            else { resolve(updated); }
        });
    });
    return promise;
}

function promiseToGetFromCollectionByObject(collection, object){
    let promise = new Promise( (resolve, reject) => {
        collection.findOne(object, (err, found) => {
            if(err){ reject(); console.log(err); }
            else { resolve(found); }
        });
    });
    return promise;
}

function promiseToFindMenuItem(menu, name){
    let promise = new Promise( (resolve, reject) => {
        menu.find({name: { $regex: new RegExp(name,  "i")}}, (err, foundMenuItem) => {
            if(err){ reject(err); }
            else{
                if(foundMenuItem.length > 1){
                    foundMenuItem.forEach(item => { if(item.name == name){ resolve(item); }}); } 
                else { resolve(foundMenuItem[0]); }
            }
        }); 
    });
    return promise;
}

module.exports = {
    promiseToGetFromCollectionById,
    promiseToDeleteFromCollectionById,
    promiseToUpdateFromCollectionById,
    promiseToGetFromCollectionByObject,
    promiseToFindMenuItem,
};