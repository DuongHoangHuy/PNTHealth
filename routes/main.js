const express =require('express')
const mainPage = require('../controllers/mainpage')

const router = express.Router()

router.route('/')
    .get(mainPage.renderMainPage)

module.exports = router