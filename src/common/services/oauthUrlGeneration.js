import * as queryString from "querystring";
export const generateUrl = async (req, res) => {
  try {
    // Generating query parameters
    const authParams = queryString.stringify({
      client_id: process.env.GOOGLE_CLIENTID,
      redirect_uri: process.env.GOOGLE_TOKEN_GENERATEURL,
      response_type: process.env.RESPONSE_TYPE,
      scope: process.env.SCOPE,
      access_type: process.env.ACCESS_TYPE,
      state: process.env.STATE,
      prompt: process.env.GOOGLE_PROMPT
    });
    const url = `${process.env.GOOGLE_AUTH_URL}${authParams}`;
    res.status(200).send({ url: url, status: true });
  } catch (error) {
    res.status(400).send({ message: "unable to generate url", status: false });
  }
};
