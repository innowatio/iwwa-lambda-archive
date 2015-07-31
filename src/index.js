import dotenv from "dotenv";

import * as s3 from "./common/s3";

dotenv.load();

export function handler (event, context) {
    return BPromise
        .try(() => {
            // Only consider the first record
            var data = new Buffer(
                event.Records[0].kinesis.data,
                "base64"
            ).toString("ascii");
            return JSON.parse(data);
        })
        .then(applicationEvent => {
            return s3.putObject({
                Bucket: process.env.S3_BUCKET,
                Key: applicationEvent.id,
                Body: JSON.stringify(applicationEvent, null, 4)
            });
        })
        .then(context.succeed)
        .then(context.fail);
};
