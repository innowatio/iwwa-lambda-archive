import * as s3 from "./common/s3";
import moment from "moment";

export default function archive (applicationEvent) {
    return s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: createFilePath(applicationEvent.timestamp) + applicationEvent.id,
        Body: JSON.stringify(applicationEvent, null, 4)
    });
}

function createFilePath (timestamp) {
    return `${moment(timestamp).format("YYYY/MM/DD")}/`;
}
