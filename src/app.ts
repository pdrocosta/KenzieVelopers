import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createProject,
  deleteDev,
  deleteProject,
  deleteProjectTech,
  getDeveloperByID,
  getProjectById,
  patchProject,
  postIDInfos,
  postTech,
  updateDev,
} from "./logic";
import { checkDevIDExists, checkDeveloperExists, checkEmailExists, checkInfosExist, checkProjectExists } from "./middleware";

const app: Application = express();

app.use(express.json());

app.post("/developers",  checkEmailExists, createDeveloper);
app.get("/developers/:id", checkDeveloperExists, getDeveloperByID);
app.patch("/developers/:id", checkDeveloperExists, checkEmailExists, updateDev);
app.delete("/developers/:id", checkDeveloperExists, deleteDev);
app.post("/developers/:id/infos", checkInfosExist,  checkDeveloperExists, postIDInfos);

app.post("/projects", checkDevIDExists, createProject);
app.get("/projects/:id", checkProjectExists, getProjectById);
app.patch("/projects/:id", checkProjectExists, checkDevIDExists, patchProject);
app.delete("/projects/:id", checkProjectExists, deleteProject);
app.post("/projects/:id/technologies", checkProjectExists, postTech);
app.delete("/projects/:id/technologies/:name", checkProjectExists, deleteProjectTech);

export default app;
