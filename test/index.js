import {resolve, reject} from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import {range} from "ramda";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import * as index from "index";

describe("handler", () => {

    const context = {
        succeed: sinon.spy(),
        fail: sinon.spy()
    };
    const kinesisEvent = {};
    const eventsCount = 100;
    const getEvents = sinon.stub().returns(range(0, eventsCount).map(id => ({id})));

    before(() => {
        index.__Rewire__("getEvents", getEvents);
    });
    after(() => {
        index.__ResetDependency__("getEvents");
    });
    beforeEach(() => {
        context.fail.reset();
        context.succeed.reset();
        getEvents.reset();
    });

    describe("success case", () => {

        const archiveEvent = sinon.stub().returns(resolve());

        before(() => {
            index.__Rewire__("archiveEvent", archiveEvent);
        });
        after(() => {
            index.__ResetDependency__("archiveEvent");
        });
        beforeEach(() => {
            archiveEvent.reset();
        });

        it("extracts events from the kinesis event and `put`-s them into S3", async () => {
            await index.handler(kinesisEvent, context);
            expect(getEvents).to.have.callCount(1);
            expect(getEvents).to.have.been.calledWith(kinesisEvent);
            expect(archiveEvent).to.have.callCount(eventsCount);
            range(0, eventsCount).forEach(id => {
                expect(archiveEvent).to.have.been.calledWith({id});
            });
        });

        it("successfully terminates the lambda function", async () => {
            await index.handler(kinesisEvent, context);
            expect(context.succeed).to.have.callCount(1);
        });

    });

    describe("failure case", () => {

        const archiveEvent = sinon.spy(() => reject(new Error("Error message")));

        before(() => {
            index.__Rewire__("archiveEvent", archiveEvent);
        });
        after(() => {
            index.__ResetDependency__("archiveEvent");
        });
        beforeEach(() => {
            archiveEvent.reset();
        });

        it("unsuccessfully terminates the lambda function", async () => {
            await index.handler(kinesisEvent, context);
            expect(context.fail).to.have.callCount(1);
            expect(context.fail).to.have.been.calledWith(new Error("Error message"));
        });

    });

});
