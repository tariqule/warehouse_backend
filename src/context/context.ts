import { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
  payload?: any; // the user object from the db
}
