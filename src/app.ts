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
  patchIDInfos,
  patchProject,
  postTech,
  updateDev,
} from "./logic";
import { checkEmailExists } from "./middleware";

const app: Application = express();

app.use(express.json());

app.post("/developers",  createDeveloper);
app.get("/developers/:id", getDeveloperByID);
app.patch("/developers/:id", updateDev);
app.delete("/developers/:id", deleteDev);
app.post("/developers/:id/infos", patchIDInfos);

app.post("/projects", createProject);
app.get("/projects/:id", getProjectById);
app.patch("/projects/:id", patchProject);
app.delete("/projects/:id", deleteProject);
app.post("/projects:id/technologies", postTech);
app.delete("/projects/:id/technologies/:name", deleteProjectTech);

export default app;
