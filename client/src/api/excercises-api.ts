import { apiEndpoint } from '../config'
import { Excercise } from '../types/Excercise';
import { CreateExcerciseRequest } from '../types/CreateExcerciseRequest';
import Axios from 'axios'
import { UpdateExcerciseRequest } from '../types/UpdateExcerciseRequest';
import { ExcerciseListResult} from '../dataViewModels/ExcerciseListResult'

export async function getExcercises(idToken: string): Promise<Excercise[]> {
  console.log('Fetching excercises')

  const response = await Axios.get(`${apiEndpoint}/excercises`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Excercises:', response.data)
  return  response.data.items
  
}

export async function createExcercise(
  idToken: string,
  newExcercise: CreateExcerciseRequest
): Promise<Excercise> {
  const response = await Axios.post(`${apiEndpoint}/excercises`,  JSON.stringify(newExcercise), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchExcercise(
  idToken: string,
  excerciseId: string,
  updatedExcercise: UpdateExcerciseRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/excercises/${excerciseId}`, JSON.stringify(updatedExcercise), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteExcercise(
  idToken: string,
  excerciseId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/excercises/${excerciseId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  excerciseId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/excercises/${excerciseId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
