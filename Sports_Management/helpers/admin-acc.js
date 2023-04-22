
module.exports={
    adminLogin:(uid,pass)=>{
        return new Promise((resolve,reject)=>{
            let status=false;
            if(uid==="admin0478" && pass==="0478"){
                status=true
            }
            console.log(status);
            resolve(status)
            console.log(uid,pass);
        })
    }
}