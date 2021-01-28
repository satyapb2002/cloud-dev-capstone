/// Imports
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { AuthHelper } from '../../helpers/authHelper'
import { ExcercisesRepository } from '../../data/dataLayer/excercisesRepository'
import { StorageHelper } from '../../helpers/storageHelper'
import { ResponseHelper } from '../../helpers/responseHelper'
import { createLogger } from '../../utils/logger'

/// Variables
const s3Helper = new StorageHelper()
const apiResponseHelper= new ResponseHelper()
const logger = createLogger('excercises')
const authHelper = new AuthHelper()

/**
 * Get authorized user exts list
 * @param event API gateway Event
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    // get user id using JWT from Authorization header
    const userId = authHelper.getUserId(event.headers['Authorization']) 
    logger.info(`get groups for user ${userId}`)

    // Get user's exrcs
    const result = await new ExcercisesRepository().getUserExcercises(userId)
    
    // Generate excrs pre-signed get url for excrss with uploaded images
    for(const record of result){
        if(record.hasImage){
            record.attachmentUrl = await s3Helper.getExcerciseAttachmentUrl(record.excerciseId)
        }
    }

    // return success response
    return apiResponseHelper.generateDataSuccessResponse(200,'items',result)
}
