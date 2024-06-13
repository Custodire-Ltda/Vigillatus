const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';

    res.render('graph.ejs',  {gestorInfo, imagePath});
});

module.exports = router;