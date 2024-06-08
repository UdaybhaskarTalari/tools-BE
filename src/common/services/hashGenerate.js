import crypto from "crypto";
export const hashGenerate = (data) => {
  const hashCode = crypto.createHash("sha1").update(data).digest("hex");
  return hashCode;
};
