import axios from 'axios';

const router = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

export default router;