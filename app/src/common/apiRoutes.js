import axios from "axios"

export const apiCall=async(url, type, data)=>{
    const response = await axios({
        method: type,
        url: url,
        data,
    })
    return response.data
}