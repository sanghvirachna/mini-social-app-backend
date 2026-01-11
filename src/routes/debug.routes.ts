import { Router } from 'express';
import { sequelize } from '../db';

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

export default router;
