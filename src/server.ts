import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import fileRouter from "@/routers/fileRouter";

class StorageApi {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static get sentryIsEnabled(): boolean {
    return !!process.env.SENTRY_DSN && !!process.env.SENTRY_ENVIRONMENT;
  }

  private async startApiServer() {
    const app = express();

    app.use(cors());
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
        environment: process.env.SENTRY_ENVIRONMENT,
      });

      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }

    app.use("/api/files", fileRouter);

    if (StorageApi.sentryIsEnabled) {
      app.use(Sentry.Handlers.errorHandler());
    }

    app.listen(StorageApi.port, () => {
      console.log(`Server listening on http://localhost:${StorageApi.port} ...`);
    });
  }

  constructor() {
    this.startApiServer();
  }
}

new StorageApi();
