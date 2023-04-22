var db=require('../dbconnection/connection')
var collection=require('../dbconnection/collections')
const { reject } = require('bcrypt/promises')
var objectId=require('mongodb').ObjectId

module.exports={


    addProducts:(product,callback)=>{
        
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{


            
            callback(data.insertedId)
            
        })

    },
    viewProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProducts:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id:objectId(productId) }).then((response)=>{
                resolve(response)
            })
        })
    },
    getproductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id:objectId(proId) }).then((product)=>{
                resolve(product)
            })
            
        }) 

    },
    updateProducts:(proId,prodetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id:objectId(proId)},{
                $set:{
                    Name:prodetails.Name,
                    Category:prodetails.Category,
                    Price:prodetails.Price,
                    Description:prodetails.Description
                }
            }).then((response)=>{
                resolve()
            })
        })
        
    },
    searchProducts:(proname)=>{
        console.log("proname"+proname);
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({Name: {'$regex': proname,'$options':'i'}
        }).then((response)=>{
                console.log(response)
                resolve()
            })
        })
    }
}