import {resolve, reject} from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import archiveEvent from "archive-event";

describe("archiveEvent", () => {

    const log = {
        info: sinon.spy(),
        fatal: sinon.spy()
    };
    const s3 = {};
    const S3_BUCKET = "S3_BUCKET";
    const timer = () => () => 999;

    before(() => {
        archiveEvent.__Rewire__("log", log);
        archiveEvent.__Rewire__("s3", s3);
        archiveEvent.__Rewire__("S3_BUCKET", S3_BUCKET);
        archiveEvent.__Rewire__("timer", timer);
    });
    after(() => {
        archiveEvent.__ResetDependency__("log");
        archiveEvent.__ResetDependency__("s3");
        archiveEvent.__ResetDependency__("S3_BUCKET");
        archiveEvent.__ResetDependency__("timer");
    });
    beforeEach(() => {
        log.info.reset();
        log.fatal.reset();
    });

    it("puts the events into S3", async () => {
        s3.putObjectAsync = sinon.stub().returns(resolve());
        await archiveEvent({
            id: "id",
            type: "type",
            timestamp: 0,
            data: {
                key: "value"
            }
        });
        expect(s3.putObjectAsync).to.have.been.calledWith({
            Bucket: "S3_BUCKET",
            Key: "1970/01/01/id",
            Body: JSON.stringify({
                id: "id",
                type: "type",
                timestamp: 0,
                data: {
                    key: "value"
                },
                archived: true
            }, null, 4)
        });
    });

    it("logs successful `put`-s", async () => {
        s3.putObjectAsync = sinon.stub().returns(resolve());
        await archiveEvent({
            id: "id",
            type: "type",
            timestamp: 0,
            data: {
                key: "value"
            }
        });
        expect(log.info).to.have.been.calledWith(
            "Put 1970/01/01/id in 999ms"
        );
    });

    it("fails when `putObjectAsync` fails", () => {
        s3.putObjectAsync = sinon.stub().returns(reject(new Error("Error message")));
        const promise = archiveEvent({
            id: "id",
            type: "type",
            timestamp: 0,
            data: {
                key: "value"
            }
        });
        return expect(promise).to.be.rejectedWith("Error message");
    });

    it("logs failures", async () => {
        s3.putObjectAsync = sinon.stub().returns(reject(new Error("Error message")));
        try {
            await archiveEvent({
                id: "id",
                type: "type",
                timestamp: 0,
                data: {
                    key: "value"
                }
            });
        } catch (err) {
            // Expected failure, ignore
        }
        expect(log.fatal).to.have.callCount(1);
        expect(log.fatal).to.have.been.calledWith(
            new Error("Error message"),
            "Failed putting 1970/01/01/id after 999ms",
            {event: {
                id: "id",
                type: "type",
                timestamp: 0,
                data: {
                    key: "value"
                }
            }}
        );
    });

});
