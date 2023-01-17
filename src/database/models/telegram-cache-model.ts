import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes } from 'sequelize';
import { sequelize } from '../instance';

export class TelegramCache extends Model<InferAttributes<TelegramCache>, InferCreationAttributes<TelegramCache>> {
  declare id: CreationOptional<number>;
  declare soundcloudId: string;
  declare telegramFileId: string;
  declare isCached: CreationOptional<boolean>;
}

TelegramCache.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  soundcloudId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  telegramFileId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isCached: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
}, {
  tableName: 'telegram_cache',
  sequelize
});