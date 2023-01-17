import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes } from 'sequelize';
import { sequelize } from '../instance';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare telegramId: number;
  declare soundcloudToken: CreationOptional<string>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegramId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  soundcloudToken: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
}, {
  tableName: 'users',
  sequelize
});