import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
