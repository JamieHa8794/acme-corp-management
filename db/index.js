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

Department.beforeSave(department =>{
    if(department.managerId===''){
        department.managerId = null;
    }
})

Department.belongsTo(User, { as: 'manager' });
User.hasMany(Department, { foreignKey: 'managerId'});

const syncAndSeed = async ()=>{
    await conn.sync({force: true})
    const [lucy, moe, larry] = await Promise.all(
        ['Lucy', 'Moe', 'Larry'].map(name => User.create({name}))
    )
    const [hr, engineering, marketing] = await Promise.all(
        ['HR', 'Engineering', 'Marketing'].map(name => Department.create({name}))
    )
    engineering.managerId = lucy.id;
    marketing.managerId = lucy.id;
    await Promise.all([engineering.save(), marketing.save()]);

}

module.exports ={
    syncAndSeed,
    models: {
        User,
        Department,
    }
}