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
    tableName: 'follows',
    timestamps: false
})
export class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare followerId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare followingId: number;
}
