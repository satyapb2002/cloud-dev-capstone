/// Imports
import { ExcerciseItem } from "../models/excercise";
import { CreateExcerciseRequest } from "../../requests/createExcerciseRequest";
import { UpdateExcerciseRequest } from "../../requests/updateExcerciseRequest";
import { XawsHelper} from "../../helpers/xawsHelper"
import { createLogger } from '../../utils/logger'

/// Variables
const logger = createLogger('excercises')
const uuid = require('uuid/v4')
const xaws = new XawsHelper()

/**
 * Excercises repository for Excercise's CURD operations
 */
export class ExcercisesRepository{
    constructor(
        private readonly docClient = xaws.getDocumentClient(),
        private readonly excercisesTable = process.env.EXCERCISE_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    )
        {}

    /**
     * Get authorized user excercises list
     * @param userId Authorized user id
     */
    async getUserExcercises(userId: string): Promise<ExcerciseItem[]>{
        const param = {
            TableName: this.excercisesTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            },
            Limit: 5
        }
        
        const dataResult = await this.docClient
                                        .query(param)
                                        .promise()
        return dataResult.Items as ExcerciseItem[]
    }

    /**
     * Create new Excercise Item
     * @param request Create excercise data
     * @param userId Logged user id
     */
    async createExcercise(request: CreateExcerciseRequest,userId: string): Promise<ExcerciseItem>{
        const item:ExcerciseItem = {
            userId: userId,
            excerciseId: uuid(),
            createdAt: new Date().toISOString(),
            name: request.name,
            calorie: request.calorie,
            hasImage: false
        }
        await this.docClient.put({
            TableName: this.excercisesTable,
            Item: item
        }).promise()
        return item
    }
    
    
    /**
     * Get Excercise record by Id
     * @param id Excercise Id
     */
    async getExcerciseById(id: string): Promise<AWS.DynamoDB.QueryOutput>{
        return await this.docClient.query({
            TableName: this.excercisesTable,
            KeyConditionExpression: 'excerciseId = :excerciseId',
            ExpressionAttributeValues:{
                ':excerciseId': id
            }
        }).promise()
    }

    async updateExcerciseImageFlag(excerciseId:string){
        await this.docClient.update({
            TableName: this.excercisesTable,
            Key:{
                'excerciseId':excerciseId
            },
            UpdateExpression: 'set  hasImage = :t',
            ExpressionAttributeValues: {
                ':t' : true
            }
          }).promise()
    }

    /**
     * Update existing Excercise record
     * @param updatedExcercise Update field details
     * @param excerciseId Excercise Id
     */
    async updateExcercise(updatedExcercise:UpdateExcerciseRequest,excerciseId:string){
        await this.docClient.update({
            TableName: this.excercisesTable,
            Key:{
                'excerciseId':excerciseId
            },
            UpdateExpression: 'set #namefield = :n, calorie = :d',
            ExpressionAttributeValues: {
                ':n' : updatedExcercise.name,
                ':d' : updatedExcercise.calorie
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
              }
          }).promise()
    }


    /**
     * Delete Excercise record
     * @param excerciseId Excercise Id
     */
    async deleteExcerciseById(excerciseId: string){
        const param = {
            TableName: this.excercisesTable,
            Key:{
                "excerciseId":excerciseId
            }
        }
         await this.docClient.delete(param).promise()
    }
    
}
