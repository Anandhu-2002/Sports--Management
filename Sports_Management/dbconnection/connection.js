const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const url='mongodb+srv://Anandhu:pro2023@cluster0.jn4weuf.mongodb.net/?retryWrites=true&w=majority'
    const dbname='Sports'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)

        state.db=data.db(dbname)
        done()

    })

    
}

module.exports.get=function(){
    return state.db
}