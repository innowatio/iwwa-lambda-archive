import {expect} from "chai";
import {range} from "ramda";

import getEvents from "get-events";

describe("`getEvents`", () => {

    it("converts `kinesis event` -> `application event`-s", () => {
        const applicationEvents = range(0, 100).map(n => ({
            type: "type",
            timestamp: n,
            data: {key: "value"}
        }));
        const kinesisEvent = {
            Records: range(0, 100).map(n => ({
                kinesis: {
                    data: new Buffer(JSON.stringify(applicationEvents[n])).toString("base64")
                }
            }))
        };
        const extractedEvents = getEvents(kinesisEvent);
        expect(extractedEvents).to.eql(applicationEvents);
    });

});
