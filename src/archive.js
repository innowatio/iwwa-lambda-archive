import * as s3 from "./common/s3";

export default function archive (applicationEvent) {
    return s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: applicationEvent.id,
        Body: JSON.stringify(applicationEvent, null, 4)
    });
}
