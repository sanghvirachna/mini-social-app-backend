import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { Follow } from '../models/follow';
import { authenticate } from '../middlewares/authenticate';
import { Op, WhereOptions } from '@sequelize/core';
import { sequelize } from '../db';

const router = express.Router();

// PUT /profile
router.put('/me/profile', authenticate, async (req: Request, res: Response): Promise<any> => {
    const { displayName, headline, bio } = req.body;

    if (!displayName || displayName.length === 0 || displayName.length > 40) {
        return res.status(400).json({ error: "displayName required, max 40 chars" });
    }
    if (headline && headline.length > 60) {
        return res.status(400).json({ error: "headline max 60 chars" });
    }
    if (bio && bio.length > 160) {
        return res.status(400).json({ error: "bio max 160 chars" });
    }

    const user = await User.findByPk((req as any).user.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        user.displayName = displayName;
        user.headline = headline || null;
        user.bio = bio || null;
        await user.save();
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
});

// GET /profile
router.get('/me/profile', authenticate, async (req: Request, res: Response) => {
    const user = (req as any).user as User;
    res.status(200).json(user);
});

// GET /people?q=<text>
router.get('/people', authenticate, async (req: Request, res: Response): Promise<any> => {
    const currentUser = (req as any).user as User;
    const q = req.query.q as string;

    const whereClause: WhereOptions<User> = {
        id: { [Op.ne]: currentUser.id }
    };

    if (q && q.length > 0) {
        whereClause.displayName = { [Op.iLike]: `%${q}%` };
    }
    console.log(whereClause)
    try {
        const users = await User.findAll({
            where: whereClause,
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)::int
                            FROM posts
                            WHERE posts."userId" = "User"."id"
                        )`),
                        'postsCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)::int
                            FROM follows
                            WHERE follows."followingId" = "User"."id"
                        )`),
                        'followersCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)::int
                            FROM follows
                            WHERE follows."followerId" = "User"."id"
                        )`),
                        'followingCount'
                    ]
                ]
            }
        });

        const followings = await Follow.findAll({
            where: { followerId: currentUser.id },
            attributes: ['followingId']
        });
        const followingIds = new Set(followings.map(f => Number(f.followingId)));

        const results = users.map(u => ({
            ...u.toJSON(),
            isFollowing: followingIds.has(Number(u.id))
        }));

        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
});

// POST /follow/:targetUserId
router.post('/follow/:targetUserId', authenticate, async (req: Request, res: Response): Promise<any> => {
    const currentUser = (req as any).user as User;
    const targetUserId = req.params.targetUserId as string;

    if (Number(targetUserId) === currentUser.id) {
        return res.status(400).json({ error: "Cannot follow yourself" });
    }

    try {
        const target = await User.findByPk(targetUserId);
        if (!target) return res.status(404).json({ error: "User not found" });

        await Follow.findOrCreate({
            where: {
                followerId: currentUser.id,
                followingId: targetUserId
            }
        });

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
});

// DELETE /follow/:targetUserId
router.delete('/follow/:targetUserId', authenticate, async (req: Request, res: Response): Promise<any> => {
    const currentUser = (req as any).user as User;
    const { targetUserId } = req.params;

    try {
        await Follow.destroy({
            where: {
                followerId: currentUser.id,
                followingId: targetUserId
            }
        });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
});

export default router;
