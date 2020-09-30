import express from "express";
import { IncomingForm } from "formidable";

const router: express.Router = express.Router();

router.use("/", express.static(FileService.uploadDirectory));
  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log(fields);
    console.log(files);

    res.status(200).send("File was successfully submitted!");
  });
});

export default router;
