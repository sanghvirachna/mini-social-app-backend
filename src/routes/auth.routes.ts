import express, { Request, Response } from 'express';
import { User } from '../models/user';

const router = express.Router();

// POST /auth/mock-login
router.post('/mock-login', async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
        const user = await User.findOrCreate({
            where: { displayName: userId },
            defaults: { displayName: userId }
        });

        return res.json({ token: user[0].id, user: user[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
