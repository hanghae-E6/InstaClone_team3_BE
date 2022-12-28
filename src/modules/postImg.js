// IAM 액세스 키와 비밀키를 가지고 유저의 S3 버킷에 접근하고, 업로드 하기 위한 로직을 가진 모듈이다.

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();
aws.config.loadFromPath(__dirname + '/../config/s3.js');

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.POSTIMG_BUCKETNAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});
module.exports = upload;
