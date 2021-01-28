/// Imports
import 'source-map-support/register'
import { S3Event,S3Handler } from 'aws-lambda'
import { ExcercisesRepository } from '../../data/dataLayer/excercisesRepository'
import { createLogger } from '../../utils/logger'

/// Variables
const logger = createLogger('excercises')
const excercisesAccess = new ExcercisesRepository()

/**
 * Get authorized user excercises list
 * @param event API gateway Event
 */
export const handler: S3Handler = async (event: S3Event): Promise<void> => {
    const fileName = event.Records[0].s3.object.key
    logger.info(`File uploaded ${fileName}`)
    //authHeader.split(' ')
    const excerciseId =  fileName.split('.')[0]
    const item = await excercisesAccess.getExcerciseById(excerciseId)
    if(item.Count == 1){
        await excercisesAccess.updateExcerciseImageFlag(excerciseId)
    }else{
        logger.error(`File uploaded ${fileName} not matching a excercise`)
    }
}
