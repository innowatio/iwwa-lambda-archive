import {S3} from "aws-sdk";
import {promisify} from "bluebird";

var s3 = new S3({
    apiVersion: "2006-03-01"
});

export var putObject = promisify(s3.putObject, s3);
