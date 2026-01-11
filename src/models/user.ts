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
    NotNull,
    Table,
    HasMany,
    BelongsToMany
} from '@sequelize/core/decorators-legacy';
import { Post } from './post';
import { Follow } from './follow';

@Table({
    tableName: 'users'
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    declare id: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare displayName: string;

    @Attribute(DataTypes.STRING)
    declare headline: string | null;

    @Attribute(DataTypes.STRING)
    declare bio: string | null;

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    declare updatedAt: CreationOptional<Date>;

    @HasMany(() => Post, { foreignKey: 'userId' })
    declare posts?: Post[];

    @BelongsToMany(() => User, {
        through: () => Follow,
        foreignKey: 'followerId',
        otherKey: 'followingId',
        inverse: { as: 'Followers' }
    })
    declare Following?: User[];

    @BelongsToMany(() => User, {
        through: () => Follow,
        foreignKey: 'followingId',
        otherKey: 'followerId',
        inverse: { as: 'Following' }
    })
    declare Followers?: User[];
}
