import express from "express";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  return res.status(200).send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/file" enctype="multipart/form-data" method="post">
    <div>Text field title: <input type="text" name="title" /></div>
    <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
    <input type="submit" value="Upload" />
    </form>
  `);
});

export default router;
