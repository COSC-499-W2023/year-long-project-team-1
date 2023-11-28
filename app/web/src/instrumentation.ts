import { createS3Bucket, getBucketName, isOwnedBucketExistException } from "@lib/s3";

export async function register() {
    const bucket = getBucketName();
    try {
        const resp = await createS3Bucket(bucket);
        console.log(`Bucket ${resp.Location} created.`);
    } catch (e) {
        if (isOwnedBucketExistException(e)) {
            console.log(`Bucket ${bucket} already exists. Nothing changed.`);
            return;
        }
        throw e;
    }
}
