import moment from "moment";

import {KEY_PREFIX_PATTERN, S3_BUCKET} from "./config";
import log from "./services/logger";
import s3 from "./services/s3";
import timer from "./utils/timer";

function getPrefix (event) {
    return moment.utc(event.timestamp).format(KEY_PREFIX_PATTERN);
}

export default async function archive (event) {
    const getElapsed = timer();
    const key = `${getPrefix(event)}/${event.id}`;
    try {
        await s3.putObjectAsync({
            Bucket: S3_BUCKET,
            Key: key,
            Body: JSON.stringify({
                ...event,
                archived: true
            }, null, 4)
        });
        log.info(`Put ${key} in ${getElapsed()}ms`);
    } catch (err) {
        log.fatal(err, `Failed putting ${key} after ${getElapsed()}ms`, {event});
        throw err;
    }
}
