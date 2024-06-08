import jwt from "jsonwebtoken";
export const middleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({ message: "Authentication Error", status: "error" });
  }
  const token = authorization;
  try {
    const decoded = jwt.verify(token, process.env.DECODE_STRING);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token verification failed", status: "error" });
  }
};
