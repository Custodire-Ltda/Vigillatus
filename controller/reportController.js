const express = require('express');
const router = express.Router();
const Camera = require('../models/Camera');

router.get('/', async (req, res) => {
    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    imagePath = imagePath || '/img/profile/default.jpg';

    const listCamera = await Camera.findAll({
        where: {
            idSetor: [gestorInfo.idSetor]
        }
    });

    res.render('report.ejs', { gestorInfo, imagePath });
});
module.exports = router;