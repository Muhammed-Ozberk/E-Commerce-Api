const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/userModel");
const Token = require('../config/token');


const register = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            res.json({ message: 'Bu email kullanımda', status: false });
        } else {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const savedUser = await User.create(({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: hashPassword,
            }));
            if (!savedUser) {
                res.json({ message: 'Kullanıcı kaydedilirken bir hata oluştu', status: false })
            } else {
                const token = await jwt.sign({ userId: savedUser.id }, process.env.JWT_SECRET);
                res.json({ message: 'Kullanıcı başarıyla kaydedildi', status: true, token: token });
            }
        }
    } catch (error) {
        res.json({ message: 'Kayıt yapılırken bilinmeyen bir hata oluştu', status: false });
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            res.json({ message: 'Kullanıcı bulunamadı', status: false });
        } else {
            const resolvePassword = await bcrypt.compare(req.body.password, user.password);
            if (!resolvePassword) {
                res.json({ message: 'Şifre hatalı', status: false });
            } else {
                const token = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
                res.json({ message: 'Kullanıcı doğrulandı', token: token, status: true });
            }
        }
    } catch (error) {
        res.json({ message: 'Giriş yapılırken bilinmeyen bir hata oluştu', status: false });
    }

}

const userInfo = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const user = await User.findOne({ attributes: ['name', 'phone', 'email','avatar'], where: { id: (await userToken).userId } });
        if (!user) {
            res.json({ message: 'Kullanıcı bilgileri getirilirken bir hata oluştu', status: false });
        } else {
            res.json({ message: 'Kullanıcı bilgileri başarıyla getirildi', status: true, data: user });
        }
    } catch (error) {
        res.json({ message: 'Kullanıcı bilgileri getirilirken bilinmeyen bir hata oluştu', status: false });
    }
}

const userUpdate = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const user = await User.findOne({ where: { id: (await userToken).userId } });
        const updatedUser = await user.update({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        });
        if (!updatedUser) {
            res.json({ message: 'Kullanıcı bilgileri güncellenirken bir hata olştu', status: false });
        } else {
            res.json({ message: 'Kullanıcı bilgileri başarıyla güncellendi', status: true, });
        }
    } catch (error) {
        res.json({ message: 'Kullanıcı bilgileri güncellenirken bilinmeyen bir hata oluştu', status: false });
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const user = await User.findOne({ where: { id: (await userToken).userId } });
        const resolvePassword = await bcrypt.compare(req.body.password, user.password);
        if (!resolvePassword) {
            res.json({ message: "Mevcut şifreniz hatalı", status: false });
        } else {
            const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
            const updatedPassword = await user.update({ password: hashPassword });
            if (!updatedPassword) {
                res.json({ message: "Şifreniz değiştirilirken bir hata oluştu", status: false });
            } else {
                res.json({ message: "Şifreniz başarıyla değiştirildi", status: true });
            }
        }
    } catch (error) {
        res.json({ message: 'Şifre değiştirilirken bilinmeyen bir hata oluştu', status: false });
    }
}

const avatarAdd = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const user = await User.findOne({ where: { id: (await userToken).userId } });
        const updatedAvatar = await user.update({ avatar: req.file.filename });
        if (!updatedAvatar) {
            res.json({ message: "Profil resmi yüklenirken hata oluştu", status: false });
        } else {
            res.json({ message: "Profil resmi başarıyla yüklendi", status: true });
        }
    } catch (error) {
        res.json({ message: 'Profil resmi yüklenirken bilinmeyen bir hata oluştu', status: false });
    }
}

module.exports = {
    register,
    login,
    userInfo,
    userUpdate,
    resetPassword,
    avatarAdd
}
