import axios from "axios";


export default class PersonnelService {


    async getPersonnels() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/personnel`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }

    async getPersonnelsRank() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/personnel_rank`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }

    async getPersonnelsSVC() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/personnel_svc`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }
}
