import express from "express";

import FileService from "@/services/FileService";

const router: express.Router = express.Router();
const fileService = new FileService();

router.use("/", express.static(FileService.uploadDirectory));

router.post("/", async (req, res) => {
  try {
    const filePath = await fileService.handleUpload(req);
    const protocol =
      process.env.NODE_ENV === "development" || process.env.INSECURE ? "http://" : "https://";
    const fileUrl = new URL(filePath, `${protocol}${process.env.DOMAIN}/api/`);
    res.status(200).send(fileUrl.href);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
