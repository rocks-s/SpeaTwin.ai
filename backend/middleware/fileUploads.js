import multer from "multer";

const photoUpload = multer({
    dest: "userUploads/"
});

export {
    photoUpload
}


