var db=require('../dbconnection/connection')
var collection=require('../dbconnection/collections')
const { reject } = require('bcrypt/promises')
var objectId=require('mongodb').ObjectId

module.exports={


    addGround:(ground)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.GROUND_COLLECTION).insertOne(ground).then((data)=>{
                resolve(data.insertedId)
                
            })
            
        })
        


    },
    viewGround:()=>{
        return new Promise(async(resolve,reject)=>{
            let ground=await db.get().collection(collection.GROUND_COLLECTION).find().toArray()
            resolve(ground)
        })
    },
    deleteGround:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.GROUND_COLLECTION).deleteOne({ _id:objectId(Id) }).then((response)=>{
                resolve(response)
            })
        })
    },
    getgroundDetails:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.GROUND_COLLECTION).findOne({ _id:objectId(Id) }).then((ground)=>{
                resolve(ground)
            })
            
        }) 

    },
    updateGround:(Id,details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.GROUND_COLLECTION).updateOne({ _id:objectId(Id)},{
                $set:{
                    GroundName:details.Name,
                    GroundAddress:details.Address,
                    District:details.District,
                    SubDistrict:details.SubDistrict,
                    Pincode:details.Pincode,
                    Contact:details.Contact
                }
            }).then((response)=>{
                resolve()
            })
        })
        
    },
    
}