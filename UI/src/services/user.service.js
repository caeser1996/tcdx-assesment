import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000';

class UserService {
    fetchDashboardData() {
        return axios.get(API_URL + '/dashboard', {headers: authHeader()});
    }

    fetchAllTasks() {
        return axios.get(API_URL + '/tasks', {headers: authHeader()});
    }

    addTask(body) {
        return axios.post(API_URL + '/tasks', body, {headers: authHeader()});
    }

    editTask(body) {
        let id = body._id
        console.log(id)
        delete body._id
        return axios.put(API_URL + '/tasks/' + id, body, {headers: authHeader()});
    }

    delete(body) {
        let id = body._id
        delete body._id
        return axios.delete(API_URL + '/tasks/' + id, {headers: authHeader()});
    }

}

export default new UserService();
