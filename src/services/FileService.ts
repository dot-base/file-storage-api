import fs from "fs";
import path from "path";
import { IncomingForm, Files, File } from "formidable";
import { Request } from "express";

export default class FileService {
  public static get uploadDirectory(): string {
    return process.env.NODE_ENV === "development" ? "./files" : "/files";
  }

  private static initializeUploadDirectory() {
    if (!fs.existsSync(this.uploadDirectory)) {
      fs.mkdirSync(this.uploadDirectory);
    }
  }

  private static initializeUploadForm(): IncomingForm {
    const form = new IncomingForm();
    form.uploadDir = this.uploadDirectory;
    form.keepExtensions = true;
    return form;
  }

  private static async parseForm(req: Request, form: IncomingForm): Promise<Files> {
    return new Promise(function (resolve, reject) {
      form.parse(req, function (err, fields, files) {
        if (err !== null) reject(err);
        else resolve(files);
      });
    });
  }

  private static filetypeIsWhitelisted(file: File): boolean {
    return file.path.match(/\.(jpg|png|mp4|pdf)$/i) ? true : false;
  }

  constructor() {
    FileService.initializeUploadDirectory();
    this.uploadForm = FileService.initializeUploadForm();
  }

  private uploadForm: IncomingForm;

  public async handleUpload(req: Request): Promise<string> {
    const filesObject = await FileService.parseForm(req, this.uploadForm);
    const files = Object.values(filesObject);
    if (files.length !== 1) throw new Error("You should submit exactly one file.");

    const file = files[0];
    if (!FileService.filetypeIsWhitelisted(file)) {
      fs.unlinkSync(file.path);
      throw new Error(
        "Invalid file type. The server only accepts files with one the following extensions: jpg, png, mp4 or pdf."
      );
    }

    return path.basename(file.path);
  }
}
