var express = require('express');
const { generate } = require('otp-generator');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers');
var product=require('../helpers/products');
const verifyLogin=(req, res, next)=>{
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/firstpage')
  }
}


// router.post('/verify-otp',async(req,res)=>{
//   userHelpers.VerifyOtp(req.body.mailid).then((response)=>{
//     console.log(response);
//     res.json(response);
//   })  
// });
//////////////////////////////////////
router.get('/', (req, res, next)=>{

  res.render('user/firstpage');
});
router.get('/firstpage', (req, res, next)=>{

  res.redirect('/');
});
router.get('/clublog',(req,res)=>{
  res.render('user/clublog')
})
router.post('/clublog',(req,res)=>{
  userHelpers.Clublogin(req.body).then((response) => {
    

    if (response.status) {
      
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/home')
    } else {
      eror=req.session.userLoginErr =true
      res.render('user/clublog',{eror})
    }
  })
})
router.get('/clubreg',(req,res)=>{
  res.render('user/clubreg')
})
router.post('/clubreg',async(req,res)=>{
   await userHelpers.Clubreg(req.body)
   res.redirect('/clublog')
})
///////////////////////////////////////
router.get('/coachlog',(req,res)=>{
  res.render('user/coachlog')
})
router.post('/coachlog',(req,res)=>{
  userHelpers.Coachlogin(req.body).then((response) => {
    

    if (response.status) {
      
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/home')
    } else {
      eror=req.session.userLoginErr =true
      res.render('user/coachlog',{eror})
    }
  })
})
router.get('/coachreg',(req,res)=>{
  res.render('user/coachreg')
})
router.post('/coachreg',async(req,res)=>{
   await userHelpers.Coachreg(req.body)
   res.redirect('/coachlog')
})
//////////////////////////////////////////
router.get('/playerlog',(req,res)=>{
  res.render('user/playerlog')
})
router.post('/playerlog',(req,res)=>{
  userHelpers.Playerlogin(req.body).then((response) => {
    

    if (response.status) {
      
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/home')
    } else {
      eror=req.session.userLoginErr =true
      res.render('user/playerlog',{eror})
    }
  })
})
router.get('/playerreg',(req,res)=>{
  res.render('user/playerreg')
})
router.post('/playerreg',async(req,res)=>{
   await userHelpers.Playerreg(req.body)
   res.redirect('/playerlog')
})
///////////////////////////////////////////

router.get('/userlog',(req,res)=>{
  res.render('user/userlog')
})
router.post('/userlog',(req,res)=>{
  userHelpers.Userlogin(req.body).then((response) => {
    

    if (response.status) {
      
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/home')
    } else {
      eror=req.session.userLoginErr =true
      res.render('user/userlog',{eror})
    }
  })
})
router.get('/userreg',(req,res)=>{
  res.render('user/userreg')
})
router.post('/userreg',async(req,res)=>{
   await userHelpers.Userreg(req.body)
   res.redirect('/userlog')
})
/////////////////////////////////////////

router.get('/home',verifyLogin,(req,res)=>{
  let user=req.session.user
  res.render('user/home',{user})
})
/////////////////////////////////////////////////////
router.get('/shopping',async(req, res)=> {
  let user = req.session.user
  let cartCount=null
  if(user){
  cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  product.viewProducts().then((products) => {
    res.render('user/view-products', { products, user,cartCount });

  })

});
 
router.get('/logout', (req, res) => {
  req.session.user=null
  req.session.userLoggedIn=false
  res.redirect('/firstpage')
});
router.get('/cart', verifyLogin,async(req, res) => {
  let products=await userHelpers.getCart(req.session.user._id)
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  
  res.render('user/cart',{products,user:req.session.user,total})
});
router.get('/add-to-cart/:id',(req, res) => {
  userHelpers.addToCart(req.params.id,req.session.user._id).then((response) => {
    res.json(response)
    
  })
});
router.post('/change-quantity',(req,res,next)=>{
  userHelpers.changeQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.getTotalAmount(req.body.userID)
    res.json(response)    
  })
});
router.get('/remove-item/:id',(req,res)=>{
  
  userHelpers.removeItem(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/cart')
  })
});
router.get('/place-order',verifyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
});
router.post('/place-order',async(req,res)=>{
  let products=await userHelpers.getCartProductList(req.body.userId)
  let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment-method']==='COD'){
      res.json({status:true})
    }else{  
          
            
      userHelpers.onlinePayment(orderId).then((response)=>{
        res.redirect(response)

      })
    }
    
    
  })
  
});
router.get('/order',verifyLogin,async(req,res)=>{
  let order=await userHelpers.getOrder(req.session.user._id)
   
  res.render('user/order',{order,user:req.session.user})
});
router.get('/remove-order-products/:id',async(req,res)=>{
  userHelpers.removeOrderedProduct(req.params.id).then(()=>{
    res.redirect('/order')
  })
});
router.get('/view-order-products/:id',verifyLogin,async(req,res)=>{
  let orderItem=await userHelpers.getOrderedProduct(req.params.id)
  res.render('user/view-orderd-product',{orderItem,user:req.session.user})
});




module.exports = router;
