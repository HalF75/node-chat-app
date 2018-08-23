const expect = require('expect');
const {Users} = require('./users');

let users;

beforeEach(() => {
    users = new Users();
    users.users = [{
        id:1,
        name:'Ricardo',
        room: 'Node Course'
    },{
        id:2,
        name:'Paulo',
        room: 'React'
    },
    {
        id:3,
        name:'Sofia',
        room: 'Node Course'
    }]
});


describe('User', () => {
    it('Should add new user', () => {
        var users = new Users();
        var user = {
            id: 123,
            name: 'Ricardo',
            room: 'myChat'        
        }

        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('Should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Ricardo', 'Sofia']);
    });

    it('Should return names for react', () => {
        var usersList = users.getUserList('React');
        expect(usersList).toEqual(['Paulo']);
    });

    it('should remove a user', () => {
        var userId = 2;
        var userRemoved = users.removeUser(userId);
        expect(userRemoved.id).toBe(userId);
    });

    it('should not remove user', () => {
        var userId = 99;
        var userRemoved = users.removeUser(userId);
        expect(userRemoved).toBeFalsy();
    });

    it('should find user', () => {
        var userId = 2;
        var getUser = users.getUser(userId);
        expect(getUser.id).toBe(userId);
    });

    it('should not find user', () => {
        var userId = 4;
        var getUser = users.getUser(userId);
        expect(getUser).toBeFalsy();
    });

});