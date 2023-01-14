import { Sequelize } from 'sequelize';
import { print } from '~/helpers';

export const sequelize = new Sequelize('sqlite:nowscbot.sqlite', {
  logging: false
});
export const logSequelize = print.create('(sequelize)');

export const initializeConnection = async () => {
  logSequelize('authenticate...');
  await sequelize.authenticate();
  logSequelize('authenticate OK');
  logSequelize('sync...');
  await sequelize.sync({
    alter: true
  });
  logSequelize('sync OK');
  logSequelize('database ready');
};