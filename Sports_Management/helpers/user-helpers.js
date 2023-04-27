var db=require('../dbconnection/connection');
var collections=require('../dbconnection/collections');
const bcrypt=require('bcrypt')
var otpgenerator=require('otp-generator');
var nodemailer=require('nodemailer');
const objectId=require('mongodb').ObjectId

module.exports={
    Clubreg:async(userData)=>{
      userData.Password=await bcrypt.hash(userData.Password,10)

        return new Promise(async(resolve,reject)=>{
            
            
            db.get().collection(collections.CLUB_COLLECTION).insertOne(userData).then((data)=>{
           
              resolve()

                

                                
            })
            
        })
        
    },
    Clublogin:(userData)=>{
      return new Promise(async(resolve,reject)=>{
         
          let response={}
          let user=await db.get().collection(collections.CLUB_COLLECTION).findOne({ Email:userData.Email })
         
          if(user){
              bcrypt.compare(userData.Password,user.Password).then((status)=>{
                  if(status){
                      response.user=user
                      response.status=true;
                      resolve(response)
                  }
                  else{
                      resolve({status:false})
                  }

              })
          }else{
              resolve({status:false})
          }

      })
  },
  ////////////////////////////////////////////
  Coachreg:async(userData)=>{
    userData.Password=await bcrypt.hash(userData.Password,10)

      return new Promise(async(resolve,reject)=>{
          
          
          db.get().collection(collections.COACH_COLLECTION).insertOne(userData).then((data)=>{
         
            resolve()

              

                              
          })
          
      })
      
  },
  Coachlogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
       
        let response={}
        let user=await db.get().collection(collections.COACH_COLLECTION).findOne({ Email:userData.Email })
       
        if(user){
            bcrypt.compare(userData.Password,user.Password).then((status)=>{
                if(status){
                    response.user=user
                    response.status=true;
                    resolve(response)
                }
                else{
                    resolve({status:false})
                }

            })
        }else{
            resolve({status:false})
        }

    })
},
////////////////////////////////////////////////
Playerreg:async(userData)=>{
  userData.Password=await bcrypt.hash(userData.Password,10)

    return new Promise(async(resolve,reject)=>{
        
        
        db.get().collection(collections.PLAYER_COLLECTION).insertOne(userData).then((data)=>{
       
          resolve()

            

                            
        })
        
    })
    
},
Playerlogin:(userData)=>{
  return new Promise(async(resolve,reject)=>{
     
      let response={}
      let user=await db.get().collection(collections.PLAYER_COLLECTION).findOne({ Email:userData.Email })
     
      if(user){
          bcrypt.compare(userData.Password,user.Password).then((status)=>{
              if(status){
                  response.user=user
                  response.status=true;
                  resolve(response)
              }
              else{
                  resolve({status:false})
              }

          })
      }else{
          resolve({status:false})
      }

  })
},
//////////////////////////////////////
Userreg:async(userData)=>{
  userData.Password=await bcrypt.hash(userData.Password,10)

    return new Promise(async(resolve,reject)=>{
        
        
        db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data)=>{
       
          resolve()

            

                            
        })
        
    })
    
},
Userlogin:(userData)=>{
  return new Promise(async(resolve,reject)=>{
     
      let response={}
      let user=await db.get().collection(collections.USER_COLLECTION).findOne({ Email:userData.Email })
     
      if(user){
          bcrypt.compare(userData.Password,user.Password).then((status)=>{
              if(status){
                  response.user=user
                  response.status=true;
                  resolve(response)
              }
              else{
                  resolve({status:false})
              }

          })
      }else{
          resolve({status:false})
      }

  })
}, 

    // VerifyOtp:(mailid)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let otp=otpgenerator.generate(6,{upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false})

    //         var transporter =  nodemailer.createTransport({
    //           service: 'gmail',
    //           host: "smtp.ethereal.email",
    //           auth: {
    //             user: 'mirror.pvltd@gmail.com',
    //             pass: 'hdutmjcpavatkhfb'
    //           }
    //         });
            
    //         var mailOptions = {
    //           from: 'mirror.pvltd@gmail.com',
    //           to: mailid,
    //           subject: 'Verify Mirror registration usin this otp.Dont share with anyone',
    //           text: otp
    //         };
            
            
    //         transporter.sendMail(mailOptions, function(error, info){
    //           if (error) {
                
    //             console.log(error);
    //           } else {
                
                
                
    //             resolve({respo:true,otp:otp});
    //           }
    //         })
            
                
            
            
    //     })
    // },
    
    addToCart:(proId,userId)=>{
        
        let proObj={
            Item:objectId(proId),
            Quantity:1
            
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})

            if(userCart){
                let proExits=userCart.product.findIndex(products=>products.Item==proId)
                if(proExits!=-1){
                    db.get().collection(collections.CART_COLLECTION).updateOne({user:objectId(userId),'product.Item':objectId(proId)},{
                        $inc:{'product.$.Quantity':1}
                    

                    }).then((response)=>{
                    resolve({addPro:false}) 
                })
                }else{
                db.get().collection(collections.CART_COLLECTION).updateOne({user:objectId(userId)},{
                   
                        $push:{product:proObj}
                    
                }).then((response)=>{
                    resolve({addPro:true})
                })
            }
            }else{
                let cartObj={
                    user:objectId(userId),
                    product:[proObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve({addPro:true})
                })
            }
        })
    },
    getCart:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        Item:'$product.Item',
                        Quantity:'$product.Quantity'
                        
                    }
                },
                {
                    $lookup:{
                        from:collections.PRODUCT_COLLECTION,
                        localField:'Item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        Item:1,
                        Quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                }

            ]).toArray()
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
                count=cart.product.length
            }
            resolve(count)
        })
    },
    changeQuantity:(product)=>{
        product.count=parseInt(product.count)
        product.qnty=parseInt(product.qnty)
        
        return new Promise(async(resolve,reject)=>{
            if(product.count==-1 && product.qnty==1){
                db.get().collection(collections.CART_COLLECTION).updateOne({_id:objectId(product.cart)},{
                    $pull:{product:{Item:objectId(product.product)}}
                }).then((response)=>{
                    resolve({removeProduct:true})
                    
            })
            }else{

            db.get().collection(collections.CART_COLLECTION).updateOne({_id:objectId(product.cart),'product.Item':objectId(product.product)},{
                $inc:{'product.$.Quantity':product.count},
                
                
            }).then((response)=>{
                resolve({status:true})
                
        })
          }
        })
    
    },
    removeItem:(proId,uId)=>{
    
        
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.CART_COLLECTION).updateOne({user:objectId(uId)},{
                
                $pull:{product:{Item:objectId(proId)}}
            }).then((response)=>{
                resolve()
                
        })

        })
    },
    getTotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})

       
            let Total=await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        Item:'$product.Item',
                        Quantity:'$product.Quantity'
                        
                       
                    }
                },
                {
                    $lookup:{
                        from:collections.PRODUCT_COLLECTION,
                        localField:'Item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        Item:1,
                        Quantity:1,
                        
                        product:{$arrayElemAt:['$product',0]}
                    }
                },
                { $addFields: {
                    Price: {$toInt:"$product.Price" }   
                 }
                    
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:["$Quantity","$Price"]}}
                    }
                }
            ]).toArray()
            
            if(Total[0]){
                resolve(Total[0].total)
            }
            else{
                resolve()
            }
            

        })
    },
    placeOrder:(order,products,total)=>{
    


        return new Promise(async(resolve,reject)=>{
            let status=order['payment-method']==='COD'?'placed':'pending'
            let orderObj={
                deliveryDetails:{
                    address:order.address,
                    mobile:order.mobile,
                    pincode:order.pincode
                },
                userId:objectId(order.userId),
                paymentMethod:order['payment-method'],
                products:products,
                total:total,
                status:status,
                date:new Date().toJSON().slice(0,10)
            

            }
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                db.get().collection(collections.CART_COLLECTION).deleteOne({user:objectId(order.userId)})
                resolve(response.insertedId)
                
            })
        })
    },
    getCartProductList:(userID)=>{


        return new Promise(async(resolve,reject)=>{
            let cartProducts=await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userID)})
            resolve(cartProducts.product)

        })
    },
    getOrder:(userID)=>{


        return new Promise(async(resolve,reject)=>{
            
           
            
            let orders=await db.get().collection(collections.ORDER_COLLECTION).find({userId:objectId(userID)}).toArray()
            
            resolve(orders)


        })
    },
    removeOrderedProduct:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.ORDER_COLLECTION).deleteOne({_id:objectId(Id)}).then((response)=>{
                resolve()
                
        })


        })
    },
    getOrderedProduct:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems=await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        Item:'$products.Item',
                        Quantity:'$products.Quantity'
                        
                    }
                },
                {
                    $lookup:{
                        from:collections.PRODUCT_COLLECTION,
                        localField:'Item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        Item:1,
                        Quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                }

            ]).toArray()
           
            resolve(orderItems)


        })
    },
    getGround:()=>{


        return new Promise(async(resolve,reject)=>{
            
           
            
            let ground=await db.get().collection(collections.GROUND_COLLECTION).find().toArray()
            
            resolve(ground)


        })
    },
getGrounddet:(gid)=>{


        return new Promise(async(resolve,reject)=>{
            
           
            
            let ground=await db.get().collection(collections.GROUND_COLLECTION).findOne({_id:objectId(gid)})          
            resolve(ground)


        })
    },

    bookGround:(clubdet,ground,cid)=>{
    


        return new Promise(async(resolve,reject)=>{
            
            let  bookingdet={
                matchDetails:{
                    team1:clubdet.team1,
                    team2:clubdet.team2,
                    date:clubdet.date,
                    start:clubdet.start,
                    end:clubdet.end,
                    category:clubdet.category
                },
                clubId:objectId(cid),
                ground:ground,
            }
            db.get().collection(collections.GROUNDBOOKING_COLLECTION).insertOne(bookingdet).then((response)=>{
                
                resolve(response.insertedId)
                
            })
        })
    },
   
    getbooking:(cid)=>{


        return new Promise(async(resolve,reject)=>{
            
           
            
            let booking=await db.get().collection(collections.GROUNDBOOKING_COLLECTION).find({clubId:objectId(cid)}).toArray()
            
            resolve(booking)


        })
    },
    removeGround:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.GROUNDBOOKING_COLLECTION).deleteOne({_id:objectId(Id)}).then((response)=>{
                resolve()
                
        })


        })
    },
    getBookedground:(gid)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems=await db.get().collection(collections.GROUNDBOOKING_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(gid)}
                },
                {
                    $unwind:'$ground'
                },
                {
                    $project:{
                        ground:'$ground._id',
                      
                        
                    }
                },
                {
                    $lookup:{
                        from:collections.GROUND_COLLECTION,
                        localField:'ground',
                        foreignField:'_id',
                        as:'ground'
                    }
                },
                {
                    $project:{
                        ground:1,
                        grounds:{$arrayElemAt:['$ground',0]}
                    }
                }

            ]).toArray()
           
            resolve(orderItems)


        })
    },
}