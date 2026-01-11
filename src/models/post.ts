import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from '@sequelize/core';
import {
    Attribute,
    PrimaryKey,
    AutoIncrement,
    NotNull,
    Table,
    BelongsTo,
    BelongsToMany
} from '@sequelize/core/decorators-legacy';
import { User } from './user';
import { PostLike } from './PostLike';

@Table({
    tableName: 'posts'
})
export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare text: string;

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>;

    @BelongsTo(() => User, { foreignKey: 'userId' })
    declare Author?: User;

    @BelongsToMany(() => User, {
        through: () => PostLike,
        foreignKey: 'postId',
        otherKey: 'userId',
        inverse: { as: 'LikedPosts' }
    })
    declare LikedBy?: User[];

    declare addLikedBy: (user: User | User[]) => Promise<void>;
    declare removeLikedBy: (user: User | User[]) => Promise<void>;
}
