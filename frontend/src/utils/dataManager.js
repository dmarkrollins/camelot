import { API } from 'aws-amplify'
import axios from 'axios'

export class DataManager {

    static async getDrawing({ id }) {
        return await API.get('camelot', `/diagrams/${id}`)
    }

    static async getAllDrawings({ search }) {
        return await API.get('camelot', `/diagrams?search=${search}`)
    }

    static async removeDrawing({ id }) {
        return await API.del('camelot', `/diagrams/${id}`)
    }

    static async saveDrawing({ name, description, drawing, image }) {
        const response = await API.post('camelot', '/diagrams', {
            body: { name, description, drawing, }
        })
        console.log('Response', response.url, response.diagramId, response.diagramName, image.size, image.type)
        try {
            // save thumbnail of diagram
            axios.put(response.url, image, {
                headers: { "content-type": image.type }
            });
            // return await axios.put(response.url,
            //     {
            //         data: image
            //     },
            //     {
            //         headers: {
            //             'Content-Type': 'image/jpeg'
            //         }
            //     })
        }
        catch (err) {
            console.log('Thumbnail upload error-----------------------\n', err)
        }
    }

}
