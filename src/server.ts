import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { sequelize } from './db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// DB Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected.');
        return sequelize.sync();
    })
    .catch(err => console.error('DB Connection Error:', err));


// --- Routes ---
app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/', postRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
