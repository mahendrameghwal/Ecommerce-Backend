// import mongoose from 'mongoose';
// import { GridFSBucket } from 'mongodb';
// import multer from 'multer';
// import { GridFsStorage } from 'multer-gridfs-storage';
// import dotenv from "dotenv";
// dotenv.config()


// let gfs: any;
// let gridfsBucket: GridFSBucket;


// interface MyStorageConfig {
//   url: string;
// }

// const storageConfig: MyStorageConfig = {
//   url: process.env.MONGO_URI!
// };

// const storage = new GridFsStorage(storageConfig as any);

// // Initialize GridFS
// mongoose.connection.once('open', () => {
//   gridfsBucket = new GridFSBucket(mongoose.connection.db as any, {
//     bucketName: 'uploads'
//   });
//   gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
//     bucketName: 'uploads'
//   });
// });

// const upload = multer({ storage: storage as unknown as multer.StorageEngine });

// export { gfs, gridfsBucket, upload };



import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

let gfs: GridFSBucket;
let gridfsBucket: GridFSBucket;

// ✅ Create storage AFTER Mongo connects
const storage = new GridFsStorage({
  url: process.env.MONGO_URI!,
  file: (req, file) => {
    return {
      filename: file.originalname, // keeps original name
      bucketName: 'uploads'       // bucket name for GridFS
    };
  }
});

// ✅ Connect to Mongo first, then init buckets
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected in GridFS');

    gridfsBucket = new GridFSBucket(mongoose.connection.db as any, {
      bucketName: 'uploads'
    });

    gfs = gridfsBucket; // alias if needed
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// ✅ Multer upload instance
const upload = multer({ storage });

export { gfs, gridfsBucket, upload };


