const CommentsRepository = require('../repositories/comments.repository.js');
const { Comments, Users, Posts } = require('../models');
const {
    ValidationError,
    AuthenticationError,
} = require('../middlewares/exceptions/error.class');
const axios = require('axios');
class CommentsService {
    // 데이터 모델을 Repository에 생성자 주입 방식으로 의존성 주입
    constructor() {
        this.commentsRepository = new CommentsRepository(
            Comments,
            Users,
            Posts
        );
    }

    // 댓글 생성 메서드
    createComment = async ({ postId, userId, comment }) => {
        // 전달받은 값을 이용해 db에 댓글 생성
        const newComment = await this.commentsRepository.createComment({
            postId,
            userId,
            comment,
        });

        // 만약, newComment가 null이면, 에러를 던짐
        if (!newComment) throw new ValidationError();

        // 새로 생성된 댓글의 id를 이용해, 댓글을 작성한 user 정보까지 db에서 조회
        const commentWithNickname = await this.commentsRepository.findComment(
            newComment.commentId
        );

        // api 명세서에서 약속한 res 값대로 댓글 정보를 담아 컨트롤러에 전달
        return {
            nickname: commentWithNickname['User.nickname'],
            comment: commentWithNickname.comment,
            updatedAt: commentWithNickname.updatedAt.toLocaleString('ko-KR', {
                timeZone: 'UTC',
            }),
        };
    };

    deleteComment = async (postId, commentId, userId) => {
        const commentData = await this.commentsRepository.findComment(
            commentId
        );

        if (!commentData) {
            throw new ValidationError('해당 댓글을 찾을 수 없습니다.', 404);
        } else if (commentData.postId != postId) {
            throw new ValidationError('해당 게시글을 찾을 수 없습니다.', 404);
        } else if (commentData.userId != userId) {
            throw new AuthenticationError('권한이 없는 유저입니다.', 404);
        }

        const result = await this.commentsRepository.deleteComment(
            commentId,
            userId
        );

        if (!result) throw new ValidationError();
    };

    papagoTranslate = async (postId, commentId) => {
        const client_id = 'sOX6rdwOgpOefCctbSWw';
        const client_secret = 'ub7Gp0cKif';
        const result = [];
        const targetComment = await this.commentsRepository.findComment(
            commentId
        );

        const commentText = targetComment.comment;
        const data = { source: 'en', target: 'ko', text: commentText };
        const config = {
            method: 'post',
            url: 'https://openapi.naver.com/v1/papago/n2mt',
            header: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret,
            },
            data: data,
        };
        await axios(config)
            .then((res) => {
                const translatedText = JSON.stringify(
                    res.data.message.result.translatedText
                );
                console.log(translatedText);
                result.push(translatedText);
            })
            .catch((err) => {
                console.log(err);
            });

        // var query = '번역할 문장을 입력하세요.';
        // app.get('/translate', function (req, res) {
        //     var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
        //     var request = require('request');
        //     var options = {
        //         url: api_url,
        //         form: { source: 'en', target: 'ko', text: query },
        //         headers: {
        //             'X-Naver-Client-Id': client_id,
        //             'X-Naver-Client-Secret': client_secret,
        //         },
        //     };
        //     request.post(options, function (error, response, body) {
        //         if (!error && response.statusCode == 200) {
        //             res.writeHead(200, {
        //                 'Content-Type': 'text/json;charset=utf-8',
        //             });
        //             res.end(body);
        //         } else {
        //             res.status(response.statusCode).end();
        //             console.log('error = ' + response.statusCode);
        //         }
        //     });
        // });
    };
}

module.exports = CommentsService;
