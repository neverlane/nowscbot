import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes } from 'sequelize';
import { sequelize } from '../instance';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare telegram_id: number;
  declare soundcloud_token: CreationOptional<string>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegram_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  soundcloud_token: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
}, {
  tableName: 'users',
  sequelize
});