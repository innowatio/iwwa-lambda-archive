import BPromise from "bluebird";
import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import archive from "archive";

describe("`archive`", function () {

    var s3 = {
        putObject: sinon.spy()
    };

    before(function () {
        process.env.S3_BUCKET = "S3_BUCKET";
        archive.__Rewire__("s3", s3);
    });

    after(function () {
        archive.__ResetDependency__("s3");
    });

    it("puts the events into S3", function () {
        var applicationEvent = {
            id: "id",
            type: "type",
            timestamp: 0,
            data: {
                key: "value"
            }
        };
        archive(applicationEvent);
        expect(s3.putObject).to.have.been.calledWith({
            Bucket: "S3_BUCKET",
            Key: "1970/01/01/id",
            Body: JSON.stringify(applicationEvent, null, 4)
        });
    });

});
