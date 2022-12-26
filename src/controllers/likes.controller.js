const LikesService = require('../services/likes.service');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../middleWares/exceptions/error.class');

class LikesController {
    constructor() {
        this.likesService = new LikesService();
    }

    checkPostLike = async (req, res, next) => {
        try {
            // 클라이언트에서 전달받은 req 값을 할당
            const { postId } = req.params;
            // 인증 미들웨어를 통해 전달 받은 userId를 userId에 할당
            const userId = res.locals.user;

            if (!userId)
                throw new AuthenticationError(
                    '로그인이 필요한 서비스입니다.',
                    403
                );

            if (!postId) {
                throw new InvalidParamsError(
                    '요청한 형식이 올바르지 않습니다.',
                    400
                );
            }
            // 해당 게시물을 서비스 단에서 사용자가 찜했는지 확인하도록 함
            const isLike = await this.likesService.checkPostLike(
                postId,
                userId
            );
            // 찜 했으면 찜하기 취소
            if (isLike) {
                return res
                    .status(200)
                    .json({ message: '게시글 찜하기를 취소했습니다.' });
            }
            // 찜 안했으면 찜하기
            res.status(201).json({
                message: '게시글을 찜했습니다.',
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = LikesController;
