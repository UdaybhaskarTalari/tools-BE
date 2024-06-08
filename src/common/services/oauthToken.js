import axios from "axios";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import * as queryString from "querystring";
export const oauthToken = async (req, res) => {
  try {
    const { code } = req.query;
    const tokenParam = queryString.stringify({
      client_id: process.env.GOOGLE_CLIENTID,
      client_secret: process.env.GOOGLE_SECRETKEY,
      code,
      grant_type: process.env.GOOGLE_AUTHORIZATION_CODE,
      redirect_uri: process.env.GOOGLE_TOKEN_GENERATEURL
    });
    // Calling Google API to generate a token with auth code and other credentials
    const {
      data: { id_token }
    } = await axios.post(`${process.env.GOOGLE_API}${tokenParam}`);
    // If token is not available, sending an error message
    if (!id_token) {
      const errorMessage = "Auth error: token not found";
      return res.status(400).json({ message: errorMessage });
    }

    // If token is available, then fetching the required data
    let { email } = jwtDecode(id_token);
    // try {
    //   let parts = email.split("@");
    //   if (parts[parts.length - 1] != "divami.com") {
    //     return res.redirect(process.env.EMAIL_URL);
    //   }
    // } catch {
    //   return res.redirect(process.env.EMAIL_URL);
    // }
    // Sign a new token with the required data
    const token = jwt.sign({ email }, process.env.DECODE_STRING, {
      expiresIn: 36000
    });
    if (token) {
      try {
        const usersData = JSON.parse(
          fs.readFileSync("./users/users.json", "utf8")
        );
        // Check if the email already exists
        const existingUserIndex = usersData.find(
          (user) => Object.keys(user)[0] == email
        );
        if (!existingUserIndex) {
          const newUser = { [email]: [] };
          usersData.push(newUser);
          // Rewrite the file with the updated data
          fs.writeFile(
            "./users/users.json",
            JSON.stringify(usersData, null, 2),
            (err) => {
              if (err) {
                res
                  .status(400)
                  .send({ message: "unable to write file", status: false });
              }
            }
          );
        }
      } catch (err) {
        res.status(400).send({ message: "unable to read file", status: false });
      }
    }
    // Set the token in the cookie of the response
    res.cookie("token", token, {
      httpOnly: false
    });
    res.redirect(process.env.GOOGLE_REDIRECT_URL);
  } catch (error) {
    res.redirect(process.env.GOOGLE_REDIRECT_URL);
  }
};
