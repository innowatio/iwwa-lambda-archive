import dotenv from "dotenv";

import archive from "./archive";
import getApplicationEvent from "./get-application-event";

dotenv.load();

export function handler (kinesisEvent, context) {
    return getApplicationEvent(kinesisEvent)
        .then(archive)
        .then(context.succeed)
        .catch(context.fail);
}
