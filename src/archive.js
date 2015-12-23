import * as s3 from "./common/s3";
import moment from "moment";

function getFilePath (timestamp) {
    return moment(timestamp).format("YYYY/MM/DD");
}

export default function archive (applicationEvent) {
    return s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: `${getFilePath(applicationEvent.timestamp)}/${applicationEvent.id}`,
        Body: JSON.stringify(applicationEvent, null, 4)
    });
}
