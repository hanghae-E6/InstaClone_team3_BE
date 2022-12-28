const FollowService = require('../services/follow.service');

class FollowController {
    followService = new FollowService();

    getFollowList = async (req, res) => {
        try {
            const { userId } = req.params;
            const followList = await this.followService.getFollowList(userId);
            res.status(200).json({ followList });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '팔로우 목록 조회 기능이 실패하였습니다.',
            });
        }
    };

    editFollow = async (req, res) => {
        try {
            const elseUserId = Number(req.params.userId);
            const { userId } = res.locals;

            await this.followService.followListEdit(userId, elseUserId);

            res.status(201).json({
                message: '팔로잉 및 팔로우 취소기능이 성공하였습니다',
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '팔로우 및 팔로우취소 기능이 실패하였습니다.',
            });
        }
    };
}

module.exports = FollowController;
