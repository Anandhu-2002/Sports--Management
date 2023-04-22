var express = require('express');
var router = express.Router();
var adminHelpers=require('../helpers/admin-acc');
var productHelpers=require('../helpers/products');

const verifyLogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  }
  else {
    res.redirect('/admin/adminlogin')
  }
};


router.get('/shopping', function(req, res) {
  

        
        productHelpers.viewProducts().then((products)=>{
        res.render('admin/view-products',{admin:true,products});
    
      })
    
  res.render('admin/view-products');
  
});



router.get('/adminlogin',(req,res)=>{
  res.redirect('/');
});

router.get('/',(req,res)=>{
  res.render('admin/adminlogin')
})
router.post('/adminlogin',(req,res)=>{
  adminHelpers.adminLogin(req.body.uname,req.body.pass).then((response) => {
    if (response) {
        req.session.admin=response
        
        productHelpers.viewProducts().then((products)=>{
        let i=0
        res.render('admin/view-products',{admin:true,products,i});
    
      })
    } else {
       
      res.redirect('/admin/adminlogin')
    }
  })
})


router.get('/add-products',verifyLogin,function(req,res){
  res.render('admin/add-products');
});
router.post('/add-products',(req,res)=>{
 

  var image=req.files.Image
  productHelpers.addProducts(req.body,(id)=>{
    
    
    image.mv('./public/product-img/'+id+'.jpg',(err)=>{
     if(!err){
        res.render('admin/add-products');
     }else{
       console.log('error')
     }
    })
    
  });
  
});
router.get('/delete-product/:id',verifyLogin,(req,res)=>{
  let productId=req.params.id
  productHelpers.deleteProducts(productId).then((response)=>{
    res.redirect('/admin/shopping')
  })
});
router.get('/edit-product/:id',async(req,res)=>{
  let prodetails=await productHelpers.getproductDetails(req.params.id)
  
  res.render('admin/edit-product',{prodetails})
});
router.post('/edit-product/:id',verifyLogin,(req,res)=>{
  productHelpers.updateProducts(req.params.id,req.body).then(()=>{
    res.redirect('/admin/shopping')
    if(req.files.Image){
     let image=req.files.Image
    image.mv('./public/product-img/'+req.params.id+'.jpg')
    }
  })
});
module.exports = router;

