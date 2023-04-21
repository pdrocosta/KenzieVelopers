
CREATE TABLE developers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE
);

CREATE TYPE OS AS ENUM ('Windows','Linux','MacOS');


CREATE TABLE developer_infos (
id SERIAL PRIMARY KEY,
"developersince" DATE NOT NULL,
"preferredos" OS ('Windows','Linux', 'MacOS') NOT NULL,
"developerid" INTEGER UNIQUE NOT NULL,
FOREIGN KEY ("developerid") REFERENCES developers(id) ON DELETE CASCADE
);

CREATE TABLE projects (
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
description TEXT,
"estimatedtime" VARCHAR(20) NOT NULL,
repository VARCHAR(120) NOT NULL,
"startdate" DATE NOT NULL,
"enddate" DATE,
"developerid" INTEGER,
FOREIGN KEY ("developerid") REFERENCES developers(id) ON DELETE SET NULL
);

CREATE TABLE technologies (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL
);

INSERT INTO technologies (name) VALUES
('JavaScript'),
('Python'),
('React'),
('Express.js'),
('HTML'),
('CSS'),
('Django'),
('PostgreSQL'),
('MongoDB');

CREATE TABLE projects_technologies (
id SERIAL PRIMARY KEY,
"addedin" DATE NOT NULL,
"technologyid" INTEGER NOT NULL,
"projectid" INTEGER NOT NULL,
FOREIGN KEY ("technologyid") REFERENCES technologies(id) ON DELETE CASCADE,
FOREIGN KEY ("projectid") REFERENCES projects(id) ON DELETE CASCADE
);