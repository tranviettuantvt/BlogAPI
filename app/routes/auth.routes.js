module.exports=(app) => {
    const auth= require('../controller/auth.controller')
    var router= require('express').Router();

    router.post("/signup", auth.signup)
    router.post("/login", auth.login)

    app.use('/api/auth', router)
}