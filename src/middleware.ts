import { QueryResult } from "pg";
import { client } from "./database";
import format from "pg-format";
import { IDeveloper, IProject } from "./interfaces";
import { NextFunction, Request, Response } from 'express'

export const checkDeveloperExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const id: number = parseInt(request.params.id)

  const queryString: string = format(
    `
      SELECT *
      FROM developers
      WHERE id = %L;
    `,
    id
  );

  const queryResult: QueryResult<IDeveloper> = await client.query(queryString);
  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: 'Developer not found',
    })
  }
  return next()
};

export const checkProjectExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const id: number = parseInt(request.params.id)

  const queryString: string = format(
    `
      SELECT *
      FROM projects
      WHERE id = %L;
    `,
    id
  );

  const queryResult: QueryResult<IProject> = await client.query(queryString);
  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: 'Project not found',
    })
  }
  return next()
};

export const checkEmailExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { email } = request.body;
  console.log(email)

  const queryString: string = format(
    `
      SELECT *
      FROM developers
      WHERE email = (%L);
    `,
    email
  );
  console.log(email)
  const queryResult: QueryResult<IDeveloper> = await client.query(queryString);
  if (queryResult.rowCount !== 0) {
    return response.status(400).json({
      message: 'Email already exists',
    });
  }
  console.log(queryResult.rows[0])
  return next()
};

export const checkInfosExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { id } = request.params;
  console.log(id)

  const queryString: string = format(
    `
      SELECT *
      FROM developer_infos
      WHERE developerid =(%L);
     
    `,
    id
  );

  const queryResult: QueryResult = await client.query(queryString);
  if (queryResult.rowCount !== 0) {
    return response.status(400).json({
      message: "Developer infos already exists." });
  }
  console.log(queryResult.rows[0])
  return next()
};


export const checkDevIDExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response> => {
  const id : number = request.body.developerid;
  console.log(id)

  const queryString: string = format(
    `
      SELECT *
      FROM developers
      WHERE id =(%L);
     
    `,
    id
  );

  const queryResult: QueryResult = await client.query(queryString);
  if (queryResult.rowCount === 0) {
    return response.status(400).json({
      message: "Developer ID not found." });
  }
  console.log(queryResult.rows[0])
  return next()
};