import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Follow } from '../models/follow';
import { authenticate } from '../middlewares/authenticate';
import { Op } from '@sequelize/core';

const router = express.Router();

// POST /posts
router.post('/post', authenticate, async (req: Request, res: Response): Promise<any> => {
    const currentUser = (req as any).user as User;
    const { text } = req.body;

    if (!text || text.length === 0 || text.length > 280) {
        return res.status(400).json({ error: "Validation failed: text required, max 280 chars" });
    }

    try {
        const post = await Post.create({
            userId: currentUser.id,
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
            include: [{ model: User, attributes: ['id', 'displayName'] }]
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;
