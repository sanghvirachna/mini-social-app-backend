import express, { Request, Response } from 'express';
import { User } from '../models/user';

const router = express.Router();

// POST /auth/mock-login
router.post('/mock-login', async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
        const [user] = await User.findOrCreate({
            where: { id: userId },
            defaults: { displayName: userId, id: userId }
        });

        return res.json({ token: userId, userId: user.id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
