const Sequelize = require('sequelize');
const { STRING } = Sequelize;


const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_corp_management_db')

const User = conn.define('user', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Department = conn.define('department', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

Department.belongsTo(User);
//User.hasMany(Department);

const syncAndSeed = async ()=>{
    await conn.sync({force: true})
    const [lucy, moe, larry] = await Promise.all(
        ['lucy', 'moe', 'larry'].map(name => User.create({name}))
    )
    console.log(lucy.get())
    const [hr, engineering, marketing] = await Promise.all(
        ['hr', 'engineering', 'marketing'].map(name => Department.create({name}))
    )
    console.log(hr.get())
}

module.exports ={
    syncAndSeed,
}