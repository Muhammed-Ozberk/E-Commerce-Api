const Token = require('../config/token');

const tokenControl = async (req, res, next) => {
    try {
        const user = Token(req.headers.authorization)
        if ((await user).status !== 200) {
            res.json({ message: 'Token geçersiz lütfen tekrar giriş yapın', status: false })
        } else {
            next();
        }
    } catch (error) {
        res.json({ message: 'Token kontrol edilirken bir hata oluştu', status: false })
    }
}

module.exports = tokenControl;