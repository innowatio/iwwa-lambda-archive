export default function getEvents (kinesisEvent) {
    return kinesisEvent.Records.map(record => JSON.parse(
        new Buffer(record.kinesis.data, "base64")
    ));
}
