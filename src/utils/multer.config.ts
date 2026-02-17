import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from "dotenv";

dotenv.config();

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI!,
    options: {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            try {
                const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    metadata: {
                        uploadedBy: (req as any).user?._id || 'anonymous',
                        contentType: file.mimetype,
                        originalname: file.originalname,
                        fieldName: file.fieldname // Store the original field name
                    }
                };
                resolve(fileInfo);
            } catch (error) {
                reject(error);
            }
        });
    }
});

// Supported mimetypes
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
     'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv' // .csv
];

// Create generic upload middleware
const upload = multer({
    storage: storage as unknown as multer.StorageEngine,
    limits: { 
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 10 // Maximum number of files allowed
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${file.fieldname}. Only images, PDFs, and Word documents are allowed!`));
        }
    }
});


export default upload;