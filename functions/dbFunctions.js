function promiseToGetFromCollectionById(collection, id){
    let promise = new Promise( (resolve, reject) => {
       collection.findById({_id: id}, (err, found) => {
           if(err){ reject(); console.log(err); }
           else { resolve(found); }
       }) 
    });
    return promise;
}

function promiseToDeleteFromCollectionById(collection, id){
    let promise = new Promise( (resolve, reject) => {
       collection.findOneAndDelete({_id: id}, (err) => {
           if(err){ reject(); console.log(err); }
           else { resolve('object deleted'); }
       }) 
    });
    return promise;
}

module.exports = {
    promiseToGetFromCollectionById: promiseToGetFromCollectionById,
    promiseToDeleteFromCollectionById: promiseToDeleteFromCollectionById,
}