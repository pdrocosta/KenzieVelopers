import { QueryResult } from "pg";

export interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

export interface IDeveloperInfo {
  id: number;
  developersince: Date;
  preferredos: "Windows" | "Linux" | "MacOS";
  developerId: number;
}
export type IDeveloperResult = QueryResult<IDeveloper>;

export type IDevCreateRes = Omit<IDeveloperInfo, "developerId" | "id">;

export type IDevCreateQRes = QueryResult<IDevCreateRes>;

export type IDeveloperInfoQRes = QueryResult<IDeveloperInfo>;

export type IDevByIDResult = {
  developerid: number;
  developername: string;
  developeremail: string;
  developerinfodevelopersince: Date | null;
  developerinfopreferredos: string | null;
};

export type IDevIDResultQuery = QueryResult<IDevByIDResult[]>;

export interface ITechnologyData {
  technologyid: number;
  technologyname: string;
}

export type ITechnologyDataQRes = QueryResult<ITechnologyData>;

export interface IProjectWithTechnologies {
  projectid: number;
  projectname: string;
  projectdescription: string;
  projectestimatedtime: string;
  projectrepository: string;
  projectstartdate: string;
  projectenddate?: string;
  projectdeveloperid: number;
  technologies: ITechnologyData[];
}

export type IProjectWithTechsQRes = QueryResult<IProjectWithTechnologies>;

export type IProject = {
  name: string;
  description: string;
  estimatedtime: string;
  repository: string;
  startdate: Date;
  enddate?: Date;
  developerid: number;
};
export interface IProjectResponse extends IProject {
  id: number;
}
export type IProjectQRes = QueryResult<IProjectResponse>;

export type ITechProjectQRes = QueryResult<IProjectDataAndTech>;

export type ITechPRojectQuery2 = QueryResult<ITechPRojectQuery>;


export type ITechPRojectQuery = {
  id: number;
  addedin: Date;
  projectid : number;
}

export type IProjectDataAndTech = {
  projectid: number;
  projectname: string;
  projectdescription: string;
  projectestimatedtime: string;
  projectrepository: string;
  technologyid: number;
  technologyname: string;
};

export type INewProjInfos = {
  name: string;
  description: string;
  estimatedtime: string;
  repository: string;
  startdate: Date;
  developerid: number;
};
