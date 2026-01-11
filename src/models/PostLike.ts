import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
} from '@sequelize/core';
import {
    Attribute,
    PrimaryKey,
    Table
} from '@sequelize/core/decorators-legacy';

@Table({
    tableName: 'post_likes',
    timestamps: false
})
export class PostLike extends Model<InferAttributes<PostLike>, InferCreationAttributes<PostLike>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare postId: number;
}
