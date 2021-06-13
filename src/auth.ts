import { sign } from "jsonwebtoken";

export const createAccessToken = (user) => {
  return sign({ userId: user.id }, "Sean", {
    expiresIn: "15m",
  });
};
