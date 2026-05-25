import express from "express";
import cors from "cors";
import { z } from "zod";

import { prisma } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

const createLogSchema = z.object({
  date: z.string(),
  workType: z.string(),
  volume: z.number(),
  unit: z.string(),
  workerName: z.string(),
});

app.get("/", (_, res) => {
  res.send("API works!");
});

app.get("/logs", async (_, res) => {
  const logs = await prisma.workLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(logs);
});

app.post("/logs", async (req, res) => {
  try {
    const data = createLogSchema.parse(req.body);

    const log = await prisma.workLog.create({
      data: {
        date: new Date(data.date),
        workType: data.workType,
        volume: data.volume,
        unit: data.unit,
        workerName: data.workerName,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({
      error: "Invalid data",
    });
  }
});

app.put("/logs/:id", async (req, res) => {
  const id = Number(req.params.id);

  const data = createLogSchema.parse(req.body);

  const updatedLog = await prisma.workLog.update({
    where: {
      id,
    },

    data: {
      date: new Date(data.date),
      workType: data.workType,
      volume: data.volume,
      unit: data.unit,
      workerName: data.workerName,
    },
  });

  res.json(updatedLog);
});

app.delete("/logs/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.workLog.delete({
    where: {
      id,
    },
  });

  res.json({
    message: "Deleted",
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});