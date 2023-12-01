export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { createS3Bucket, getBucketName, isOwnedBucketExistException } = await import("@lib/s3");
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
}
