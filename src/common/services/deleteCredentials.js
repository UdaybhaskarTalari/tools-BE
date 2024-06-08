import * as fs from "fs";
import jwt from "jsonwebtoken";
import { sendingPastCredentials } from "./sendingPastCredentials.js";
export const deleteCredentials = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  const data = body;
  let email;
  const token = authorization;
  try {
    const decoded = jwt.verify(token, process.env.DECODE_STRING);
    email = decoded.email;
  } catch {
    return res.status(402).send({ message: "Token Error", status: false });
  }
  try {
    const usersData = await JSON.parse(
      fs.readFileSync("./users/users.json", "utf8")
    );
    let currentUserData = usersData;
    for (const record in currentUserData) {
      // let index = 0;
      if (Object.keys(currentUserData[record])[0] == email) {
        // for (const each of currentUserData[record][email]) {
        //   if (each.file == data.file) {
        //     currentUserData[record][email].splice(index, 1);
        //   }
        //   index += 1;
        // }
        currentUserData[record][email] = currentUserData[record][email].filter(
          (each) => each.file != data.file
        );
        const jsonData = JSON.stringify(currentUserData, null, 2);
        fs.writeFile("./users/users.json", jsonData, (err) => {
          if (err) {
            return res
              .status(404)
              .send({ message: "Unable to create file", status: false });
          } else {
            return sendingPastCredentials(req, res);
          }
        });
        break;
      }
    }
  } catch (error) {
    res
      .status(200)
      .send({ message: "session data is not deleted", status: true });
  }
};
