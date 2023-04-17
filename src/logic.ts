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
  ITechProjectQRes,
} from "./interfaces";
import { QueryResult } from "pg";
import { checkDeveloperExists, checkProjectExists } from "./middleware";

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

  const developerExists = await checkDeveloperExists(Number(id));

  if (developerExists!) {
    return response.status(404).json({ message: "Developer not found." });
  }

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

  const developerExists = await checkDeveloperExists(Number(id));

  if (developerExists!) {
    return response.status(404).json({ message: "Developer not found." });
  }

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

  const developerExists = await checkDeveloperExists(Number(id));

  if (developerExists!) {
    return response.status(404).json({ message: "Developer not found." });
  }

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
const patchIDInfos = async (
  request: Request,
  response: Response
): Promise<Response<IDeveloperInfo>> => {
  const { id } = request.params;
  const payload: IDeveloperInfo = request.body;

  const developerExists = await checkDeveloperExists(Number(id));

  if (!developerExists) {
    return response.status(404).json({ message: "Developer not found." });
  }

  if (!["Windows", "Linux", "MacOS"].includes(payload.preferredOS)) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const queryString: string = format(
    `
      UPDATE developers_infos
      SET (developerId, developerSince, preferredOS) = ($1, $2, $3)
      WHERE developerid = $4
      RETURNING *;
    `,
    id,
    payload.developerSince,
    payload.preferredOS,
    id
  );

  const queryResult: IDeveloperInfoQRes = await client.query(queryString);

  const devInfos: IDeveloperInfo = queryResult.rows[0];

  return response.status(201).send(devInfos);
};
const createProject = async (
  request: Request,
  response: Response
): Promise<Response<IProjectResponse>> => {
  const payload: IProject = request.body;

  const developerExists = await checkDeveloperExists(payload.developerId);

  if (!developerExists) {
    return response.status(404).json({ message: "Developer not found" });
  }

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

  const projectExists = await checkProjectExists(Number(id));

  if (!projectExists) {
    return response.status(404).json({ message: "Project not found." });
  }

  const queryProjectTechs: string = format(
    `
      SELECT 
      
      pt.projectId AS projectId, p.name AS projectName, p.description AS projectDescription, p.estimatedTime AS projectEstimatedTime,
      p.repository AS projectRepository, p.startDate AS projectStartDate, p.endDate AS projectEndDate,
      p.developerId AS projectDeveloperId, pt.technologyId AS technologyId, t.name AS technologyName
      
      FROM projects_technologies pt
      
      JOIN projects p ON p.id = pt.projectId
      
      LEFT JOIN technologies t ON t.id = pt.technologyId
      
      WHERE pt.projectId = %L;
    `,
    Number(id)
  );

  const queryProjectTechsResult: IProjectQRes = await client.query(
    queryProjectTechs
  );

  return response.status(200).json(queryProjectTechsResult.rows);
};
const patchProject = async (
  request: Request,
  response: Response
): Promise<Response<IProject>> => {
  const { id } = request.params;
  const payload: INewProjInfos = request.body;
  const developerExists = await checkDeveloperExists(payload.developerId);

  if (!developerExists) {
    return response.status(404).json({ message: "Developer not found." });
  }

  const projectExists = await checkProjectExists(Number(id));

  if (!projectExists) {
    return response.status(404).json({ message: "Project not found." });
  }

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

  const projectExists = await checkProjectExists(Number(id));

  if (projectExists!) {
    return response.status(404).json({ message: "Project not found." });
  }

  const queryString = format(
    `
        DELETE FROM projects
        WHERE id = %L;
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

  const projectExists = await checkProjectExists(Number(id));

  if (!projectExists) {
    return response.status(404).json({ message: "Project not found." });
  }

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
        WHERE name = %L
        RETURNING *;
      `,
    name
  );

  const queryResultName: QueryResult = await client.query(queryTechnologieName);
  const techInfos = queryResultName.rows[0];

  if (!techInfos) {
    return response.status(400).json({
      message: "Technology not found.",
      options: validTechnologies,
    });
  }

  const queryCheckExistingName = format(
    `
        SELECT * FROM project_technologies
        WHERE technologyId = %L
        RETURNING *;
      `,
    techInfos.id
  );

  const queryResultExistingName: QueryResult = await client.query(
    queryCheckExistingName
  );
  const existingTechInfo = queryResultExistingName.rows[0];

  if (existingTechInfo) {
    return response.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  const queryString: string = format(
    `
    INSERT INTO project_technologies (projectId, technologyId)
    VALUES (%L, %L)
    RETURNING project_technologies.id, technologies.name AS technologyName,
    projects.id AS projectId, projects.name AS projectName,
    projects.description AS projectDescription,
    projects.estimatedTime AS projectEstimatedTime,
    projects.repository AS projectRepository,
    projects.startDate AS projectStartDate,
    projects.endDate AS projectEndDate;
    `,
    id,
    techInfos.id
  );

  const queryResult: ITechProjectQRes = await client.query(queryString);
  const newProjectTech: IProjectDataAndTech = queryResult.rows[0];

  return response.status(201).send(newProjectTech);
};
const deleteProjectTech = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id, name } = request.params;

  const projectExists = await checkProjectExists(Number(id));
  if (!projectExists) {
    return response.status(404).json({ message: "Project not found." });
  }

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
        WHERE name = %L
        RETURNING *;
      `,
    name
  );

  const queryResultName: QueryResult = await client.query(queryTechnologieName);
  const techInfos = queryResultName.rows[0];

  const queryCheckExistingName = format(
    `
        SELECT FROM project_technologies
        WHERE technologyId = %L AND projectId = %L
        RETURNING *;
      `,
    techInfos.id,
    id
  );

  const queryResultExistingName: QueryResult = await client.query(
    queryCheckExistingName
  );
  const existingTech: ITechProjectQRes = queryResultExistingName.rows[0];

  if (!existingTech) {
    return response.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  const queryString: string = format(
    `
        DELETE FROM project_technologies
        WHERE projectId = %L AND technologyId = %L;
      `,
    id,
    techInfos.id
  );

  await client.query(queryString);
  return response.status(204).send();
};
export {
  createDeveloper,
  getDeveloperByID,
  updateDev,
  deleteDev,
  patchIDInfos,
  createProject,
  getProjectById,
  patchProject,
  deleteProject,
  postTech,
  deleteProjectTech,
};
