/// Imports
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { AuthHelper } from '../../helpers/authHelper'
import { UpdateExcerciseRequest } from '../../requests/UpdateExcerciseRequest'
import { ExcercisesRepository } from '../../data/dataLayer/excercisesRepository'
import { ResponseHelper } from '../../helpers/responseHelper'
import { createLogger } from '../../utils/logger'

/// Variables
const logger = createLogger('excercises')
const excercisesAccess = new ExcercisesRepository()
const apiResponseHelper = new ResponseHelper()
const authHelper = new AuthHelper()

/**
 * Update existing excercise belong to authorized user
 * @param event API getway event
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    // get excercise id from path parameters
    const excerciseId = event.pathParameters.excerciseId

    //Extract update fields from event body
    const updatedExcercise: UpdateExcerciseRequest = JSON.parse(event.body)
    
    // get user id using JWT from Authorization header
    const userId = authHelper.getUserId(event.headers['Authorization'])
  
    // get excercise item if any
    const item = await excercisesAccess.getExcerciseById(excerciseId)
  
    // validate excercise already exists
    if(item.Count == 0){
        logger.error(`user ${userId} requesting update for non exists excercise with id ${excerciseId}`)
        return apiResponseHelper.generateErrorResponse(400,'EXCERCISE not exists')
    } 

    // validate excercise belong to authorized user
    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting update excercise does not belong to his account with id ${excerciseId}`)
        return apiResponseHelper.generateErrorResponse(400,'EXCERCISE does not belong to authorized user')
    }

    logger.info(`User ${userId} updating group ${excerciseId} to be ${updatedExcercise}`)

    // update Excercisen 
    await new ExcercisesRepository().updateExcercise(updatedExcercise,excerciseId)

    return apiResponseHelper.generateEmptySuccessResponse(204)
}
