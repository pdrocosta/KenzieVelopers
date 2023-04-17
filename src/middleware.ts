import { QueryResult } from "pg";
import { client } from "./database";
import format from "pg-format";

export const checkDeveloperExists = async (developerid : number): Promise<boolean> => {
    const queryString: string = format(
      `
            SELECT id
            FROM developers
            WHERE id = %L;
          `,
          developerid
    );
  
    const queryResult: QueryResult = await client.query(queryString);
    return queryResult.rows.length > 0;
  };
  export const checkProjectExists = async (projectId : number): Promise<boolean> => {
    const queryString: string = format(
      `
            SELECT id
            FROM projects
            WHERE id = %L;
          `,
          projectId
    );
  
    const queryResult: QueryResult = await client.query(queryString);
    return queryResult.rows.length > 0;
  };
  