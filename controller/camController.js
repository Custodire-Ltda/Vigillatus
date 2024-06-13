const express = require('express');
const router = express.Router();

const Camera = require('../models/Camera');

router.get('/', async(req, res)=>{

    const listCamera = await Camera.findAll();

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('camera.ejs',  {gestorInfo, imagePath});
});

module.exports = router;