import express from "express";

import FileService from "@/services/FileService";

const router: express.Router = express.Router();
const fileService = new FileService();

router.use("/", express.static(FileService.uploadDirectory));

router.post("/", async (req, res) => {
  try {
    const fileUrl = await fileService.handleUpload(req);
    res.status(200).send(`${process.env.DOMAIN}/api/${fileUrl}`);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
