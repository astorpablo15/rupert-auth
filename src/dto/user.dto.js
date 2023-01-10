class UserDTO{
    constructor(data){
        this.fullName = data.fullName,
        this.username = data.username
    }

    build(){
        return this
    }
}

module.exports = UserDTO;