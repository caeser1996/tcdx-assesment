const express = require('express')
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/user")
const auth = require("../middleware/auth")

const router = new express.Router()

/*  POST - CREATE USER ACCOUNT  */
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    data = req.body.email + req.body.user_name;
    let apiKey = Buffer.from(data).toString('base64')
    user.api_key = apiKey
    user.avatar = "https://randomuser.me/api/portraits/thumb/men/75.jpg"
    try {
        await user.save()
        const token = await user.generateAuthToken()
        /*  user.generateAuthToken() calls 'await user.save()' so no need to save() above in fact. */
        res.status(201).send({
            user: user,
            token: token,
            message:"Make sure to save the api_key generated for user rest all api_keys can be only accessed with user_name and api_key combination."
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

/*  POST - LOGIN USER   */
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.user_name, req.body.api_key)
        const token = await user.generateAuthToken()
        let user_resp = {
            "token": {
                "name": user.name,
                "token": token
            },
            "image": user.avatar //Random images for user
        }
        res.status(200).send(user_resp)
    } catch (e) {
        res.status(400).send(e)
    }
})


/*  POST - LOGOUT USER  */
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router