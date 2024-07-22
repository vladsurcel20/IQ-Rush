import axios from "axios";

export default axios.create({
    baseURL: 'https://localhost:7139/api/answers'
})