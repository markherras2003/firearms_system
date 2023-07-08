import axios from "axios";


export default class FireArmsService {

    async getFireArms() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/firearms`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }


       async getFireArmsID(datas) {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/firearms/selectedlog/${datas}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }

    async getPersonnels() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/personnel/mydata/123`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }

    async getFireArmsMonitoring() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/firearmsmonitoringlog`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }

}
