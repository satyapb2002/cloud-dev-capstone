import { XawsHelper} from "./xawsHelper"


/**
 * Common S3 functions
 */
export class StorageHelper{

    constructor(
        private readonly  s3:AWS.S3 = new XawsHelper().getS3(process.env.region,process.env.EXCERCISE_BUCKET) ,
          private readonly  signedUrlExpireSeconds = 60 * 5
    ){
        
    }

    /**
     * Generate attachment presigned Get-Url 
     * @param excerciseId Excercise id
     */
    async getExcerciseAttachmentUrl(excerciseId: string): Promise<string>{
        try{
            await this.s3.headObject({
            Bucket: process.env.EXCERCISE_BUCKET,
            Key: `${excerciseId}.png` 
        }).promise();
        
        return  this.s3.getSignedUrl('getObject', {
            Bucket: process.env.EXCERCISE_BUCKET,
            Key: `${excerciseId}.png`,
            Expires: this.signedUrlExpireSeconds
            });
        }catch(err){
            console.log(err)
        }
        return null
    }

    /**
     * Generate attachment presigned Put-Url
     * @param exrId excer Id
     */
    getPresignedUrl(excerciseId: string): string{
        return this.s3.getSignedUrl('putObject', {
            Bucket: process.env.EXCERCISE_BUCKET,
            Key: `${excerciseId}.png`,
            Expires: this.signedUrlExpireSeconds
          }) as string ;
    }
}
