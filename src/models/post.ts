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
    BelongsTo
} from '@sequelize/core/decorators-legacy';
import { User } from './user';

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
}
