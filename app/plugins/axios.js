import axios from 'axios'

export default axios.create({
    baseURL: 'http://egc-med-heliopolis:5001/',
})