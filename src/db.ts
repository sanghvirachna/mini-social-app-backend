import { Sequelize, ModelStatic } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import * as dotenv from "dotenv";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Follow } from "./models/follow";
import { PostLike } from "./models/PostLike";

dotenv.config();

const models = {
    User,
    Post,
    Follow,
    PostLike
};
const modelsArray: ModelStatic[] = Object.values(models);

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DATABASE || 'minisocial',
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false
    },
    clientMinMessages: "notice",
    models: modelsArray,
});

export { models, sequelize, modelsArray };
