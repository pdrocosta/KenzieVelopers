import { QueryResult } from "pg";

export interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

export interface IDeveloperInfo {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId: number;
}
export type IDeveloperResult = QueryResult<IDeveloper>;

export type IDevCreateRes = Omit<IDeveloperInfo, "developerId" | "id">;

export type IDevCreateQRes = QueryResult<IDevCreateRes>;

export type IDeveloperInfoQRes = QueryResult<IDeveloperInfo>;

export type IDevByIDResult = {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
};

export type IDevIDResultQuery = QueryResult<IDevByIDResult[]>;

export interface ITechnologyData {
  technologyId: number;
  technologyName: string;
}

export type ITechnologyDataQRes = QueryResult<ITechnologyData>;

export interface IProjectWithTechnologies {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: string;
  projectEndDate?: string;
  projectDeveloperId: number;
  technologies: ITechnologyData[];
}

export type IProjectWithTechsQRes = QueryResult<IProjectWithTechnologies>;

export type IProject = {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: string;
  endDate?: string;
  developerId: number;
};
export interface IProjectResponse extends IProject {
  id: number;
}
export type IProjectQRes = QueryResult<IProjectResponse>;

export type ITechProjectQRes = QueryResult<IProjectDataAndTech>;

export type IProjectDataAndTech = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  technologyId: number;
  technologyName: string;
};

export type INewProjInfos = {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  developerId: number;
};
