const {syncAndSeed, models: { User, Department} } = require('./db/index')
const express = require('express')
const app = express();
const path = require('path');

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res, next) =>{
    try{
        const [users, departments] = await Promise.all([
            User.findAll(),
            Department.findAll()
        ])
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href='/public/stylesheet.css'/>
                </head>
                <body>
                    <h1>
                        Users
                    </h1>
                    <ul>
                        ${users.map(user =>{
                            return(`
                                <li>
                                    ${user.name}
                                </li>
                            `)
                        }).join('')}
                    </ul>
                        <h1>
                            Departments
                        </h1>
                    <ul>
                    ${departments.map(department =>{
                        return(`
                            <li>
                                ${department.name}
                            </li>
                        `)
                    }).join('')}
                </ul>
                </body>
            </html>
        `);
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