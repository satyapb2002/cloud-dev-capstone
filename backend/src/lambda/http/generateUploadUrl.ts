/// Imports
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { StorageHelper } from '../../helpers/storageHelper';
import { ResponseHelper } from '../../helpers/responseHelper';
import { ExcercisesRepository } from '../../data/dataLayer/excercisesRepository'
import { AuthHelper } from '../../helpers/authHelper'
import { createLogger } from '../../utils/logger'


// Variables
const excercisesAccess = new ExcercisesRepository()
const apiResponseHelper = new ResponseHelper()
const logger = createLogger('excercises')
const authHelper = new AuthHelper()


/**
 * Generate upload pre-signed url for excercise image upload
 * @param event API getway Event
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
     logger.info(`${event.pathParameters.excerciseId}`)    
    // get excercise id from path parameters
    const excerciseId = event.pathParameters.excerciseId
    
    // get user id using JWT from Authorization header
    const userId = authHelper.getUserId(event.headers['Authorization'])
 
     logger.info(`${userId}`)    
    // get excercise item if any
    const item = await excercisesAccess.getExcerciseById(excerciseId)

    logger.info('step1')    
    // validate excercise already exists
    if(item.Count == 0){
        logger.error(`user ${userId} requesting put url for non exists excercise with id ${excerciseId}`)
        return apiResponseHelper.generateErrorResponse(400,'Excercise not exists')
    }

    logger.info('step2')    
    // validate excercise belong to authorized user
    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting put url excercise does not belong to his account with id ${excerciseId}`)
        return apiResponseHelper.generateErrorResponse(400,'Excercise does not belong to authorized user')
    }
    
    logger.info('step3')    
    // Generate S3 pre-signed url for this excercise 
    const url = new StorageHelper().getPresignedUrl(excerciseId)

    logger.info(`${url}`)    
    
    return apiResponseHelper
            .generateDataSuccessResponse(200,"uploadUrl",url)
}
