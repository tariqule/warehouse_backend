import { sign } from "jsonwebtoken";

export const tokeSecretKey = "Sean";
export const refershTokeSecretKey = "seanReshToken";

export const createAccessToken = (user) => {
  return sign({ firstName: user.firstName }, tokeSecretKey, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user) => {
  return sign(
    { firstName: user.firstName, tokenVersion: user.tokenVersion },
    refershTokeSecretKey,
    {
      expiresIn: "7d",
    }
  );
};
