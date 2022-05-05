const Slider = require("../model/sliderModel");

const slider = async (req, res, next) => {
    try {
        const sliderList = await Slider.findAll({ attributes: ['id', 'title', 'description', 'image'] });
        if (!sliderList) {
            res.json({
                message: 'Slider itmeleri getirilirken bir hata oluştu',
                status: false,
            });
        } else {
            res.json({
                message: 'Slider itmeleri başarıyla getirildi',
                status: true,
                data: sliderList
            });
        }
    } catch (error) {
        res.json({ message: "Slider getirilirken bilinmeyen bir hata oluştu", status: false });
    }
}


module.exports = slider;