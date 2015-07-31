import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import getApplicationEvent from "get-application-event";

describe("`getApplicationEvent`", function () {

    it("returns a promise", function () {
        var ret = getApplicationEvent();
        // Handle promise failure to avoid warning logs
        ret.catch(ignore => ignore);
        expect(ret).to.be.an.instanceOf(BPromise);
    });

    it("extracts data from a kinesis event (into an application event)", function () {
        var applicationEvent = {
            type: "type",
            timestamp: 0,
            data: {
                key: "value"
            }
        };
        var kinesisEvent = {
            Records: [{
                kinesis: {
                    data: new Buffer(JSON.stringify(applicationEvent)).toString("base64")
                }
            }]
        };
        var extractedEvent = getApplicationEvent(kinesisEvent);
        expect(extractedEvent).to.eventually.eql(applicationEvent);
    });

});
