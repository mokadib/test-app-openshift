import express, { Request, Response } from "express";

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello from test-app on OpenShift!",
    status: "running",
  });
});


app.get("/test", (req: Request, res: Response) => {
  res.json({
    message: "this is a new deplyoment!",
    status: "running",
    version: "2.0.0",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "This is my second endpoint from OpenShift!",
    version: "3.0.0",
  });
});


app.get("/omg", (req: Request, res: Response) => {
  res.json({
    message: "This is version 2 API!",
    version: "4.0.0"
  });
});

app.get("/fifi", (req: Request, res: Response) => {
  res.json({
    message: "This is version 2 API!",
    version: "5.0.0"
  });
});

app.listen(PORT, () => {
  console.log(`test-app is running on port ${PORT}`);
});