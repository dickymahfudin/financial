'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  income.init(
    {
      user_id: DataTypes.INTEGER,
      idr: DataTypes.FLOAT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'income',
    }
  );
  return income;
};
