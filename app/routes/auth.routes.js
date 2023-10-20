module.exports=(app) => {
    const auth= require('../controller/auth.controller')
    var router= require('express').Router();
    const refresh=require('../controller/refreshToken.controller')

    router.post("/signup", auth.signup)
    router.post("/login", auth.login)
    router.post('/refreshToken', refresh.createAccessToken)
    router.delete('/logout', refresh.logout)

    app.use('/api/auth', router)
}