import dotenv from "dotenv";

dotenv.load();

export const S3_BUCKET = process.env.S3_BUCKET;
export const S3_PUT_CONCURRENCY = process.env.S3_PUT_CONCURRENCY || 10;
export const KEY_PREFIX_PATTERN = process.env.KEY_PREFIX_PATTERN || "YYYY/MM/DD";
