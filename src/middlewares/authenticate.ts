import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (typeof authHeader === 'string') {
        token = authHeader.split(' ')[1] || authHeader;
    } else if (Array.isArray(authHeader)) {
        const headerVal = authHeader[0] as string;
        token = headerVal?.split(' ')[1] || headerVal;
    }

    // In this mock, token === userId
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = await User.findByPk(token);
        if (!user) return res.status(401).json({ error: "Invalid token" });

        // Attach user to request (TS requires extending Request, casting for brevity here)
        (req as any).user = user;
        next();
    } catch (err) {
        next(err);
    }
};
