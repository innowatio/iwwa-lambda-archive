import {map} from "bluebird";

import {S3_PUT_CONCURRENCY} from "./config";
import archiveEvent from "./archive-event";
import getEvents from "./get-events";

export async function handler (kinesisEvent, context) {
    try {
        const events = getEvents(kinesisEvent);
        await map(events, archiveEvent, {concurrency: S3_PUT_CONCURRENCY});
        context.succeed();
    } catch (err) {
        context.fail(err);
    }
}
