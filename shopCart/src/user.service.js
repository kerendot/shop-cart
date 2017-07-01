import $ from 'jquery';

const urlLogin = 'http://localhost:3000/login';

var user = null;

const isAdmin = () => {
    return user && user.isAdmin
}

const login = (name, pass) => {
    var userToLogin = { name, pass };
    console.log(userToLogin);

    //// trying using FETCH - doesn't work
    // var prmUser = fetch(urlLogin, {
    //     method:'POST', 
    //     //This is the line we need for sending this data
    //     headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
    //     mode : 'cors',
    //     body: passObj
    //     // body: JSON.stringify({pass})
    // });


    return $.post(urlLogin, userToLogin)
        .then(res => {
            console.log('got user from server successfully');
            user = res;
            return user;
        })
        .fail(err => {
            console.log('wrong user details');
            // alert('wrong password');
        });
}

export default {
    login,
    isAdmin
}