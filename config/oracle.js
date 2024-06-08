import { Sequelize } from "sequelize";
export const oracle = async (req, res) => {
  const sequelize = new Sequelize("orcl", "SYSTEM", "1234", {
    host: "localhost",
    port: "1521",
    dialect: "oracle"
  });
  sequelize.authenticate().then(() => {
    sequelize
      .query("SELECT * from TABLE1", { type: sequelize.QueryTypes.SELECT })
      .then((results) => {
        res.json({ results: results });
      })
      .catch((error) => {});
  });
};
