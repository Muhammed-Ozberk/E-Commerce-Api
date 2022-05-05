const multer = require('multer');
const path = require('path');


const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
       
        cb(null, path.join(__dirname, "../uploads/avatar"));
    },

    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}` + path.extname(file.originalname));
    }
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      
        cb(null, true);
    } else {
    
        cb(null, false);
    }
}

const uploadImage = multer({ storage: myStorage, fileFilter: imageFileFilter});

module.exports = uploadImage;