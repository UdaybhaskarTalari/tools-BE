import * as fs from "fs";
import jwt from "jsonwebtoken";
export const setCredentials = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  const data = body;
  let email;
  const token = authorization;
  try {
    const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
    email = decodedToken.email;
  } catch {
    return res.status(401).send({ message: "Token Error", status: false });
  }
  try {
    const usersData = await JSON.parse(
      fs.readFileSync("./users/users.json", "utf8")
    );
    let currentUserData = usersData;
    /**
     * remove the file name and then compare and add exists
     */
    for (const record in usersData) {
      if (Object.keys(usersData[record])[0] == email) {
        for (const each of currentUserData[record][email]) {
          if (
            // JSON.stringify(Object.values(each)) ===
            // JSON.stringify(Object.values(data))
            each.file == data.file
          ) {
            return res.status(200).send({
              message: "file name already exists",
              status: false
            });
          }
        }
        const times = new Date().toISOString().replace(/[:.]/g, "");
        const time = new Date();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        data["file"] =
          data["file"] +
          "_" +
          times.substring(0, 10) +
          "_" +
          hours +
          "_" +
          minutes +
          "_" +
          seconds;
        currentUserData[record][email].push(data);
        const jsonData = JSON.stringify(currentUserData, null, 2);
        fs.writeFileSync("./users/users.json", jsonData, (err) => {
          if (err) {
            return res.status(404).send({
              message: "unable to create file",
              status: false,
              error: err
            });
          }
        });
        break;
      }
    }
    res.status(200).send({ message: "session stored", status: true });
  } catch (error) {
    res.status(200).send({ message: "session stored", status: true });
  }
};
