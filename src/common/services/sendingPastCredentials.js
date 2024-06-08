import * as fs from "fs";
import jwt from "jsonwebtoken";
export const sendingPastCredentials = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  let usersData;
  const token = authorization;
  const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
  const email = decodedToken.email;
  try {
    usersData = await JSON.parse(fs.readFileSync("./users/users.json", "utf8"));
  } catch (err) {
    return res
      .status(404)
      .send({ message: "unable to read file", status: false, error: err });
  }
  try {
    const userData = usersData.find(
      (record) => Object.keys(record)[0] == email
    );
    if (userData) {
      const files = userData[email]
        .filter((data) => data.dbType == body.dbType)
        .map((data) => data.file);

      return res.status(200).send({
        message: "sending past session data",
        files: files,
        status: true
      });
    } else {
      return res.status(404).send({
        message: "user not found",
        status: false
      });
    }
  } catch (error) {
    res.status(400).send({ message: "unable to read file", status: false });
  }
};
