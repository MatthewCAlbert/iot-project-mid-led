import express from "express";
import jwt from 'jsonwebtoken';
import { User } from "../data/entities/user.entity";

declare module "express" {
    export interface Request {
      user?: jwt.JwtPayload | Auth
    }
}
