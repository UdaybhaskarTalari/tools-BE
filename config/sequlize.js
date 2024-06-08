import { Sequelize } from "sequelize";
export const sequelize = async (req, res) => {
  const { body } = req;
  const { DBtype, passwd, user_id, DBname } = body;
  const seq = new Sequelize(DBname, user_id, passwd, {
    host: "localhost",
    dialect: DBtype
  });
};
