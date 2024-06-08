import * as fs from "fs";
import jwt from "jsonwebtoken";
export const sendingReqCredentialsData = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  const { file } = body;
  const token = authorization;
  const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
  const email = decodedToken.email;
  let usersData;
  try {
    usersData = await JSON.parse(fs.readFileSync("./users/users.json", "utf8"));
  } catch (err) {
    return res
      .status(404)
      .send({ message: "unable to read file", status: false, error: err });
  }
  try {
    const userData = usersData.find(
      (record) => Object.keys(record)[0] === email
    );
    if (userData) {
      userData[email].find((data) => {
        if (data.file == file) {
          return res.status(200).send({
            message: "sending session data",
            data: data,
            status: true
          });
        }
      });
    }
  } catch (error) {
    res.status(401).send({ message: "Token is not valid", status: false });
  }
};
