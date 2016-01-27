import {S3} from "aws-sdk";
import {promisifyAll} from "bluebird";

const s3 = new S3({
    apiVersion: "2006-03-01"
});
export default promisifyAll(s3);
