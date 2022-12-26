const CommentsService = require('../services/comments.service');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../middlewares/exceptions/error.class');

class CommentsController {
    constructor() {
        this.commentsService = new CommentsService();
    }

    createComment = async (req, res, next) => {
        try {
            // 클라에서 전달받은 req 값을 구조분해 할당
            const { postId } = req.params;
            const { comment } = req.body;
            // 인증 미들웨어에서 넘겨준 userId를 userId에 할당
            const { userId } = res.locals;

            // 만약 토큰 페이로드에 userId 값이 담겨 있지 않다면 undefined를 반환하므로, 여기서 한 번 더 검증
            if (!userId) {
                throw new AuthenticationError();
            }
            // req.body 값 유무와 string으로 받아 오는지 검증
            else if (!comment || typeof comment !== 'string') {
                throw new InvalidParamsError();
            }

            // req에서 받아온 값들을 서비스 레이어로 넘겨 댓글 생성 비즈니스 로직 처리
            const newComment = await this.commentsService.createComment({
                postId: Number(postId),
                userId,
                comment,
            });

            // 댓글 저장 성공시, 클라로 새로 추가한 댓글 정보를 전달
            res.status(201).json({ data: newComment });
        } catch (err) {
            // 발생한 모든 에러는 에러핸들러 미들웨어를 거쳐 처리
            next(err);
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            // 클라에서 전달받은 req 값을 구조분해 할당
            const { postId, commentId } = req.params;
            // 인증 미들웨어에서 넘겨준 userId를 userId에 할당
            const { userId } = res.locals;

            // 만약 토큰 페이로드에 userId 값이 담겨 있지 않다면 undefined를 반환하므로, 여기서 한 번 더 검증
            if (!userId) {
                throw new AuthenticationError(
                    '로그인이 필요한 서비스입니다.',
                    403
                );
            }

            // req에서 받아온 값들을 서비스 레이어로 넘겨 댓글 삭제 비즈니스 로직 처리
            await this.commentsService.deleteComment(
                Number(postId),
                Number(commentId),
                userId
            );
            // 서비스 레이어에서 처리한 데이터를 클라로 넘겨 줌
            res.status(200).json({ message: '댓글이 삭제되었습니다.' });
        } catch (err) {
            // 발생한 모든 에러는 에러핸들러 미들웨어를 거쳐 처리
            next(err);
        }
    };
}

module.exports = CommentsController;
