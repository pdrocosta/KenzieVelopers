import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import {
  IDevByIDResult,
  IDevCreateQRes,
  IDevCreateRes,
  IDevIDResultQuery,
  IDeveloper,
  IDeveloperInfo,
  IDeveloperInfoQRes,
  IDeveloperResult,
  INewProjInfos,
  IProject,
  IProjectDataAndTech,
  IProjectQRes,
  IProjectResponse,
  IProjectWithTechnologies,
  IProjectWithTechsQRes,
  ITechPRojectQuery,
  ITechPRojectQuery2,
  ITechProjectQRes,
} from "./interfaces";
import { QueryResult } from "pg";
import {
  checkDeveloperExists,
  checkEmailExists,
  checkProjectExists,
} from "./middleware";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response<IDevCreateRes>> => {
  const payload: IDeveloper = request.body;

  const queryString: string = format(
    `
          INSERT INTO developers(%I)
          VALUES (%L)
          RETURNING *;
        `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: IDevCreateQRes = await client.query(queryString);
  const newDeveloper: IDevCreateRes = queryResult.rows[0];

  return response.status(201).json(newDeveloper);
};
const getDeveloperByID = async (
  request: Request,
  response: Response
): Promise<Response<IDevByIDResult>> => {
  const { id } = request.params;

  const queryString: string = format(
    `
      SELECT d.*, di.*
      FROM developers d
      LEFT JOIN developer_infos di ON d.id = di.developerId
      WHERE d.id = %L;
    `,
    Number(id)
  );

  const queryResult: IDevIDResultQuery = await client.query(queryString);

  const devByID = queryResult.rows[0];

  return response.status(200).send(devByID);
};
const updateDev = async (
  request: Request,
  response: Response
): Promise<Response<IDeveloper>> => {
  const id: number = parseInt(request.params.id);
  const payload: Omit<IDeveloper, "id"> = request.body;

  const queryString: string = format(
    `
        UPDATE developers
        SET(%I) = ROW(%L)
        WHERE id = %L
        RETURNING *;
        `,
    Object.keys(payload),
    Object.values(payload),
    id
  );

  const queryResult: IDeveloperResult = await client.query(queryString);
  const updatedDev: IDeveloper = queryResult.rows[0];

  return response.status(200).send(updatedDev);
};
const deleteDev = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  const queryString = format(
    `
        DELETE FROM developers
        WHERE id = %L;
      `,
    Number(id)
  );

  const deletedDev: QueryResult = await client.query(queryString);
  return response.status(204).send();
};
const postIDInfos = async (
  request: Request,
  response: Response
): Promise<Response<IDeveloperInfo>> => {
  const { id } = request.params;
  const payload: IDeveloperInfo = request.body;
  console.log(request.body);

  const validOSOptions = ["Windows", "Linux", "MacOS"];
  if (!validOSOptions.includes(payload.preferredos)) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: validOSOptions,
    });
  }

  const queryString: string = format(
    `
      UPDATE developer_infos
      SET (%I) = (%L)
      WHERE developerid =(%L)
      RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload),
    id
  );

  const queryResult: IDeveloperInfoQRes = await client.query(queryString);

  const devInfos: IDeveloperInfo = queryResult.rows[0];
  console.log(devInfos, "aqui", payload, request.body);
  return response.status(201).send(devInfos);
};
const createProject = async (
  request: Request,
  response: Response
): Promise<Response<IProjectResponse>> => {
  const payload: IProject = request.body;

  const queryString: string = format(
    `
          INSERT INTO projects(%I)
          VALUES (%L)
          RETURNING *;
        `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: IProjectWithTechsQRes = await client.query(queryString);
  const newProject: IProjectWithTechnologies = queryResult.rows[0];

  return response.status(201).json(newProject);
};
const getProjectById = async (
  request: Request,
  response: Response
): Promise<Response<Array<IProjectWithTechnologies>>> => {
  const { id } = request.params;

  console.log(id);
  const queryProjectTechs: string = format(
    `
      SELECT 
      
      pt.projectId AS projectId, p.name AS projectName, p.description AS projectDescription, p.estimatedTime AS projectEstimatedTime,
      p.repository AS projectRepository, p.startDate AS projectStartDate, p.endDate AS projectEndDate,
      p.developerId AS projectDeveloperId, pt.technologyId AS technologyId, t.name AS technologyName
      
      FROM projects_technologies pt
      
      JOIN projects p ON p.id = pt.projectId
      
      LEFT JOIN technologies t ON t.id = pt.technologyId
      
      WHERE pt.projectId = (%L);
    `,
    Number(id)
  );

  const queryProjectTechsResult: IProjectQRes = await client.query(
    queryProjectTechs
  );
  console.log(queryProjectTechsResult.rows[0]);
  return response.status(200).json(queryProjectTechsResult.rows[0]);
};
const patchProject = async (
  request: Request,
  response: Response
): Promise<Response<IProject>> => {
  const { id } = request.params;
  const payload: INewProjInfos = request.body;

  const queryString: string = format(
    `
    UPDATE projects
    SET(%I) = ROW(%L)
      WHERE id = (%L)
      RETURNING *;
    `,

    Object.keys(payload),
    Object.values(payload),
    id
  );

  const queryResult: IProjectQRes = await client.query(queryString);

  const devInfos: IProjectResponse = queryResult.rows[0];

  return response.status(201).send(devInfos);
};
const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  const queryString = format(
    `
        DELETE FROM projects
        WHERE id = (%L);
      `,
    Number(id)
  );

  const deletedDev: QueryResult = await client.query(queryString);
  return response.status(204).send();
};
const postTech = async (
  request: Request,
  response: Response
): Promise<Response<IProjectDataAndTech>> => {
  const { id } = request.params;
  const { name } = request.body;

  const validTechnologies = [
    "JavaScript",
    "Python",
    "React",
    "Express.js",
    "HTML",
    "CSS",
    "Django",
    "PostgreSQL",
    "MongoDB",
  ];
  if (!validTechnologies.includes(name)) {
    return response.status(400).json({
      message: "Technology not supported.",
      options: validTechnologies,
    });
  }

  const queryTechnologieName = format(
    `
        SELECT * FROM technologies
        WHERE name = (%L);
      `,
    name
  );

  const queryResultName: QueryResult = await client.query(queryTechnologieName);
  const techInfos = queryResultName.rows[0];

  if (techInfos.rowCount === 0) {
    return response.status(400).json({
      message: "Technology not found.",
      options: validTechnologies,
    });
  }

  const queryCheckExistingName = format(
    `
        SELECT * FROM projects_technologies
        WHERE technologyid = (%L);
      `,
    techInfos.id
  );

  const queryResultExistingName: QueryResult = await client.query(
    queryCheckExistingName
  );
  const existingTechInfo = queryResultExistingName.rowCount > 0;

  if (existingTechInfo) {
    return response.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  const queryInput = [techInfos.id, id, new Date()];
  const queryKeys = ["projectid", "technologyid"];

  const queryString: string = format(
    `INSERT INTO
    projects_technologies("technologyid", "projectid", "addedin")
VALUES
   ( (%L),  (%L),  (%L));`,
    id,
    techInfos.id,
    new Date()
  );

  const queryResult: ITechPRojectQuery2 = await client.query(queryString);
  const newProjectTech: ITechPRojectQuery = queryResult.rows[0];

  const queryStringResponse:
  INSERT INTO projects (projectid, technologyid)
  VALUES (%L)
  RETURNING projects_technologies.id, technologies.name AS technologyname,
  projects.id AS projectid, projects.name AS projectname,
  projects.description AS projectdescription,
  projects.estimatedtime AS projectestimatedtime,
  projects.repository AS projectrepository,
  projects.startdate AS projectstartdate,
  projects.enddate AS projectenddate;
  `)

  return response.status(201).send(newProjectTech);
};
const deleteProjectTech = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id, name } = request.params;

  const validTechnologies = [
    "JavaScript",
    "Python",
    "React",
    "Express.js",
    "HTML",
    "CSS",
    "Django",
    "PostgreSQL",
    "MongoDB",
  ];
  if (!validTechnologies.includes(name)) {
    return response.status(400).json({
      message: "Technology not supported.",
      options: validTechnologies,
    });
  }

  const queryTechnologieName = format(
    `
        SELECT FROM technologies
        WHERE name = (%L)
        RETURNING *;
      `,
    name
  );

  const queryResultName: QueryResult = await client.query(queryTechnologieName);
  const techInfos = queryResultName.rows[0];

  const queryCheckExistingName = format(
    `
        SELECT FROM project_technologies
        WHERE technologyId = (%L) AND projectId = (%L)
        RETURNING *;
      `,
    techInfos.id,
    id
  );

  const queryResultExistingName: QueryResult = await client.query(
    queryCheckExistingName
  );
  const existingTech = queryResultExistingName.rowCount > 0;

  if (!existingTech) {
    return response.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  const queryString: string = format(
    `
        DELETE FROM project_technologies
        WHERE projectId = (%L) AND technologyId = (%L);
      `,
    id,
    techInfos.id
  );

  await client.query(queryString);
  return response.status(204).send();
};
export {
  postIDInfos,
  createDeveloper,
  getDeveloperByID,
  updateDev,
  deleteDev,
  createProject,
  getProjectById,
  patchProject,
  deleteProject,
  postTech,
  deleteProjectTech,
};
/* `
    INSERT INTO projects (projectid, technologyid)
    VALUES (%L)
    RETURNING projects_technologies.id, technologies.name AS technologyname,
    projects.id AS projectid, projects.name AS projectname,
    projects.description AS projectdescription,
    projects.estimatedtime AS projectestimatedtime,
    projects.repository AS projectrepository,
    projects.startdate AS projectstartdate,
    projects.enddate AS projectenddate;
    `*/
