/// Imports
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { AuthHelper } from '../../helpers/authHelper'
import { ExcercisesRepository } from '../../data/dataLayer/excercisesRepository'
import { ResponseHelper } from '../../helpers/responseHelper'
import { createLogger } from '../../utils/logger'

/// Variables
const excercisesAccess = new ExcercisesRepository()
const apiResponseHelper = new ResponseHelper()
const logger = createLogger('excercise')
const authHelper = new AuthHelper()

/**
 * Delete existing excercise item belong to authorized user
 * @param event API gateway event
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    // get excercise id from path parameters
    const excerciseId = event.pathParameters.excerciseId
    
    // get user id using JWT from Authorization header
    const userId = authHelper.getUserId(event.headers['Authorization'])

    // get excercise item if any
    const item = await excercisesAccess.getExcerciseById(excerciseId)

    // validate excercise already exists
    if(item.Count == 0){
        logger.error(`user ${userId} requesting delete for non exists excercise with id ${excerciseId}`)
        return apiResponseHelper.generateErrorResponse(400,'Excercise not exists')
    }

    // validate excercise belong to authorized user
    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting delete excercise does not belong to his account with id ${excerciseId}`)
        return apiResponseHelper.generateErrorResponse(400,'Excercise does not belong to authorized user')
    }
    logger.info(`User ${userId} deleting excercise ${excerciseId}`)

    // Delete excercise record
    await excercisesAccess.deleteExcerciseById(excerciseId)
    
    return apiResponseHelper
            .generateEmptySuccessResponse(204)
}
