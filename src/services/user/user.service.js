const UserModel = require('../mongo/models/user.model');

class UserService {
    constructor(){}

    async getUserByCondition(condition){
        return await UserModel.findOne(condition);
    }

    async createUser(userData){
        const userStage = new UserModel(userData);
        return await userStage.save();
    }

}

module.exports = UserService;