const {syncAndSeed, models: { User, Department} } = require('./db/index')
const express = require('express')
const app = express();
const path = require('path');


app.use('/public', express.static(path.join(__dirname, 'public')))


app.get('/', async (req, res, next) =>{
    try{
        const [users, departments] = await Promise.all([
            User.findAll({
                include: [Department]
            }),
            Department.findAll({
                include: [User]
            })
        ])
        // res.send({
        //     users,
        //     departments
        // })
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href='/public/stylesheet.css'/>
                </head>
                <body>
                    <div class='users-container'>
                        <h1>
                            Users
                        </h1>
                        <ul>
                            ${users.map(user =>{
                                return(`
                                    <li>
                                        <div>
                                        Name: ${user.name}
                                        </div>
                                        <div class='departments-managed'>
                                        Departments Managed:
                                        <ul>
                                            ${user.departments.length ? 
                                                user.departments.map(department =>{
                                                return(`
                                                    <li>
                                                        ${department.name}
                                                    </li>
                                                `)
                                            }).join('')
                                        :
                                            `No Departments Managed`
                                        }
                                        </ul>
                                    </li>
                                `)
                            }).join('')}
                        </ul>
                    </div>
                    <div class='hr'>
                    </div>
                        <div class='departments-container'>
                            <h1>
                                Departments
                            </h1>
                        <ul>
                        ${departments.map(department =>{
                            return(`
                                <li>
                                    <div>
                                    Name: ${department.name}
                                    </div>
                                    <div class='manager'>
                                        Manager: 
                                        <form>
                                        <select>
                                            <option>
                                            Not Managed
                                            </option>
                                            ${users.map(user =>{
                                                return(`
                                                <option ${user.id == department.userId ? 'selected="selected"':''}>
                                                    ${user.name}
                                                </option>
                                                `)
                                            })}
                                        </select>
                                        </form>
                                    </div>
                                </li>
                            `)
                        }).join('')}
                        </ul>
                    </div>
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