/// Imports
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateExcerciseRequest } from '../../requests/createExcerciseRequest'
import { AuthHelper } from '../../helpers/authHelper'
import { ExcercisesRepository } from '../../data/dataLayer/excercisesRepository'
import { ResponseHelper } from '../../helpers/responseHelper'
import { createLogger } from '../../utils/logger'


/// Variables
const logger = createLogger('excercises')
const authHelper = new AuthHelper()

/**
 * Create new Excercise Item
 * @param event API gateway event
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    // parse excercise field from event body
    const newExcercise: CreateExcerciseRequest = JSON.parse(event.body)

    // get user id using JWT from Authorization header
    const userId = authHelper.getUserId(event.headers['Authorization'])
    logger.info(`create excercise for user ${userId} with data ${newExcercise}`)

    // Save excercise item to database
    const item = await new ExcercisesRepository()
                            .createExcercise(newExcercise,userId)

    // return success response                            
    return new ResponseHelper()
                .generateDataSuccessResponse(201,'item',item)

}
