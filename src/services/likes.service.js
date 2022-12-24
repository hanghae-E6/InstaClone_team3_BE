const LikesRepository = require('../repositories/likes.repository');

class LikesService {
    constructor() {
        this.likesRepository = new LikesRepository();
    }

    checkPostLike = async (postId, userId) => {
        const isLike = await this.likesRepository.checkPostLike(postId, userId);

        if (!isLike) {
            await this.likesRepository.createLike(postId, userId);
            return false;
        } else {
            await this.likesRepository.deleteLike(postId, userId);
            return true;
        }
    };
}

module.exports = LikesService;
