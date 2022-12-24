// IAM 액세스 키와 비밀키를 가지고 유저의 S3 버킷에 접근하고, 업로드 하기 위한 로직을 가진 모듈이다.
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRETACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }, // key 속성은 업로드하는 파일이 어떤 이름으로 버킷에 저장되는지에 대한 속성이다.
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});
module.exports = upload;
