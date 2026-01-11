import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Follow } from '../models/follow';
import { authenticate } from '../middlewares/authenticate';
import { Op } from '@sequelize/core';

const router = express.Router();

// POST /posts
router.post('/posts', authenticate, async (req: Request, res: Response): Promise<any> => {
    const { text } = req.body;

    if (!text || text.length === 0 || text.length > 280) {
        return res.status(400).json({ error: "Validation failed: text required, max 280 chars" });
    }

    const user = (req as any).user as User;

    try {
        const post = await Post.create({
            userId: user.id,
            text
        });
        return res.status(201).json(post);
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
});

// GET /feed
router.get('/feed', authenticate, async (req: Request, res: Response) => {
    const currentUser = (req as any).user as User;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    try {
        const followings = await Follow.findAll({
            where: { followerId: currentUser.id },
            attributes: ['followingId']
        });
        const followingIds = followings.map(f => f.followingId);

        const feedUserIds = [currentUser.id, ...followingIds];

        const posts = await Post.findAll({
            where: {
                userId: { [Op.in]: feedUserIds }
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    association: Post.associations.Author,
                    attributes: ['id', 'displayName', 'headline', 'bio']
                },
                {
                    association: Post.associations.LikedBy,
                    attributes: ['id', 'displayName']
                }
            ]
        });

        // Add isLiked field
        const result = posts.map(p => {
            const json = p.toJSON();
            const likedBy = json.LikedBy || [];
            return {
                ...json,
                likeCount: likedBy.length,
                isLiked: likedBy.some((u: any) => u.id === currentUser.id)
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// POST /posts/:postId/like
router.post('/posts/:postId/like', authenticate, async (req: Request, res: Response): Promise<any> => {
    const currentUser = (req as any).user as User;
    const postId = req.params.postId;

    try {
        const post = await Post.findByPk(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Add like
        await post.addLikedBy(currentUser);

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
});

// DELETE /posts/:postId/like
router.delete('/posts/:postId/like', authenticate, async (req: Request, res: Response): Promise<any> => {
    const currentUser = (req as any).user as User;
    const postId = req.params.postId;

    try {
        const post = await Post.findByPk(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Remove like
        await post.removeLikedBy(currentUser);

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
});

export default router;
