import { API } from 'aws-amplify'

export class DataManager {

    static async getDrawing({ id }) {
        return await API.get('camelot', `/diagrams/${id}`)
    }

    static async getAllDrawings({ search }) {
        return await API.get('camelot', `/diagrams?search=${search}`)
    }

    static async saveDrawing({ name, description, drawing }) {
        return await API.post('camelot', '/diagrams', {
            body: { name, description, drawing }
        })
    }
}
