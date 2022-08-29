const {syncAndSeed, models: { User, Department} } = require('./db/index')
const express = require('express')
const app = express();

app.get('/', async (req, res, next) =>{
    try{
        const [users, departments] = await Promise.all([
            User.findAll(),
            Department.findAll()
        ])
        res.send({
            users,
            departments
        });
    }
    catch(err){
        next(err);
    }
})


const init = async () =>{
    try{
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`))
    }
    catch(err){
        console.log(err)
    }
}

init();