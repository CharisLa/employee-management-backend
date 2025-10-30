// Employee model definition: responsible for enforcing core data constraints.
export default (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    position: { type: DataTypes.STRING },
    salary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 }
  }, {});
  return Employee;
};
