import BPromise from "bluebird";

export default function getApplicationEvent (kinesisEvent) {
    return BPromise.try(() => {
        // Only consider the first record
        var data = new Buffer(
            kinesisEvent.Records[0].kinesis.data,
            "base64"
        ).toString("ascii");
        return JSON.parse(data);
    });
}
