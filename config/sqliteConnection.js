import { Sequelize } from "sequelize";
export const sqlite = async (req, res) => {
  const sequelize = new Sequelize("", "", "", {
    dialect: "sqlite",
    storage: "C:/Users/Uday/Desktop/sqliteDb.db"
  });
  sequelize.authenticate().then(() => {
    sequelize
      .query("SELECT * from user_info;", { type: sequelize.QueryTypes.SELECT })
      .then((results) => {
        res.json({ results: results });
      })
      .catch((error) => {});
  });
};
