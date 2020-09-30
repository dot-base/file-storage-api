import express from "express";
import cors from "cors";

import formRouter from "@/routers/formRouter";
import fileRouter from "@/routers/fileRouter";

class StorageApi {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private async startApiServer() {
    const app = express();

    app.use(cors());
    app.use("/", formRouter);
    app.use("/api/file", fileRouter);

    app.listen(StorageApi.port, () => {
      console.log(`Server listening on http://localhost:${StorageApi.port} ...`);
    });
  }

  constructor() {
    this.startApiServer();
  }
}

new StorageApi();
