'use strict';

const express = require('express');

const morgan = require('morgan');

const { users } = require('./data/users');

const PORT = process.env.PORT || 3000;

let currentUser = null;

let currentFriend = null;



const handleHome = (req, res) => {
    if(!currentUser) {res.redirect('/signin');}
    res.render('pages/homepage', {
        title: 'Welcome to FriendFace',
        currentUser: currentUser,
        users: users,
        handleFriend: handleFriend,
        handleHome: handleHome
    });
}

const handleSignin = (req, res) => {
    if(currentUser) {res.redirect('/');return;}
    res.render('pages/signinPage', {
        title: 'Sign In to FriendFace'
    });
}

const handleUser = (req, res) => {
    if(!currentUser) {res.redirect('/signin');}
    const id = req.params.id;
    res.render('pages/homepage', {
        title: 'FriendFace',
        currentUser: currentUser,
        users: users,
        handleHome: handleHome
    });
}

const handleName = (req, res) => {
    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName);
    if (currentUser) {res.redirect('/'); return;}
    res.send('Name Received');
    // or res.redirect(`${currentUser ? '/' : '/signin/}`);
}

const handleFriend = (req, res) => {
    const id = req.params.id;
    currentFriend = users.find(user => user.id === id);
    res.render('pages/friendpage', {
        title: 'Welcome to FriendFace',
        currentUser: currentUser,
        currentFriend: currentFriend,
        users: users,
        handleFriend: handleFriend,
        handleHome: handleHome
    });
}

const handlefourOhFour = (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
}
// -----------------------------------------------------

// server endpoints

express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')


    // endpoints
    .get('/', handleHome)
    .get('/signin', handleSignin)
    .get('/user/:id', handleUser)
    .get('/getname', handleName)
    .get('/friend/:id', handleFriend)
    .get('*', handlefourOhFour)



    .listen(PORT, () => console.log(`Listening on port ${PORT}`));