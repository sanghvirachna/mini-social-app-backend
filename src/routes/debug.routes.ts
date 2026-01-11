import { Router } from 'express';
import { sequelize } from '../db';

import { User } from '../models/user';

const router = Router();

// Sync Database
router.post('/sync-db', async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        res.status(200).json({ message: 'Database synced successfully' });
    } catch (error) {
        console.error('Error syncing database:', error);
        res.status(500).json({ error: 'Failed to sync database', details: error });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Seed Users
router.post('/seed-users', async (req, res) => {
    try {
        await User.bulkCreate([
            { displayName: 'Alice' },
            { displayName: 'Bob' },
            { displayName: 'Charlie' }
        ]);
        res.json({ message: 'Seeded 3 users' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
