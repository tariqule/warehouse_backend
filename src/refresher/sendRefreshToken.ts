import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  console.log(token);
  res.cookie("seanToken", token, {
    httpOnly: true,
  });
};
