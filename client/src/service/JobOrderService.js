import axios from "axios";


export default class JobOrderService {


    async getJobOrders() {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const response = await axios.get(`/joborder`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data.data;
    }

    myPrintData = (printData) => {
        printData.value = printData;
        let { id, job_id, client_name, unit_description,
            unit_model, unit_accessories, unit_problem,
            resolution, received_by, job_order_by,
            tech_incharge, phone_no, createdAt } = printData.value || {};
        console.log('print');
        console.log(printData);
        const extraCss = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css';
        const extraHead = '<meta http-equiv="Content-Language"content="zh-cn"/>';
        const extraScripts = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js';
        const styles = '@page { size: A4 landscape;} .text-decoration-underline-full-width { background:red;display: inline-block; text-decoration: underline; } ';
        const content = `<html>
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="${extraCss}" />
                ${extraHead}
                <style>
                    ${styles}
                </style>
                <body>
                    <div class="row">
                <h1 class="mb-3 pb-3 border-bottom"></h1>
                <div class="col-sm-6">
                    <h5>Armory Monitoring System</h5>
                    <h6>Door A17 & A18 Yoho Center</h6>
                    <h6>Sanito, Ipil, Zamboanga Sibugay 7001</h6>
                    <h6>(062) 957-5132 / 09176252540</h6>
                    <h6>TIN# 949-007-949-000</h6>
                    <h5 class="pb-2">J.O #: <u class="text-decoration-underline">${job_id}</u></h5>
                    <div class="mb-3"></div>
                </div>
                <div class="col-sm-3"></div>
                <div class="col-sm-3 text-end">
                    <img src="layout/images/logo.jpg" height="150" width="150" />
                </div>
            </div>
            <div class="mb-3"></div>
            <div class="row">
                <div class="col-sm-3">
                    <h6>CLIENT NAME:</h6>
                    <h6>UNIT DESCRIPTION:</h6>
                    <h6>MODEL:</h6>
                    <h6>ACCESSORIES:</h6>
                    <h6>PROBLEM:</h6>
                    <h6>RESOLUTION:</h6>
                    <h6>RECEIVED BY:</h6>
                    <h6>JOB ORDER BY:</h6>
                    <h6>TECHNICIAN INCHARGE:</h6>
                </div>
                <div class="col-sm-3 text-left" style="margin-left: -25px">
                    <h6><u class="text-decoration-underline">${client_name}</u></h6>
                    <h6><u class="text-decoration-underline">${unit_description}</u></h6>
                    <h6><u class="text-decoration-underline">${unit_model}</u></h6>
                    <h6><u class="text-decoration-underline">${unit_accessories}</u></h6>
                    <h6><u class="text-decoration-underline">${unit_problem}</u></h6>
                    <h6><u class="text-decoration-underline">${resolution}</u></h6>
                    <h6><u class="text-decoration-underline">${received_by}</u></h6>
                    <h6><u class="text-decoration-underline">${job_order_by}</u></h6>
                    <h6><u class="text-decoration-underline">${tech_incharge}</u></h6>
                </div>
                <div class="col-sm-3"></div>
                <div class="col-sm-3 text-end">
                    <h6>DATE:<u class="text-decoration-underline">${createdAt}</u></h6>
                    <h6>CONTACT#:<u class="text-decoration-underline">${phone_no}</u></h6>
                </div>
            </div>
            <div class="mb-5"></div>
            <div class="row">
                <p>NOTE: ALL REPAIRED ITEMS WILL HAVE 5 DAYS GRACE PERIOD FOR CUSTOMER TO CLAIM THEIR UNITS, EXCEEDING DAYS WILL BE CHARGED FIFTY PESOS (PHP50.00) PER DAY STORAGE FEE.</p>
            </div>
            <div class="mb-5"></div>
            <div class="row">
                <div class="col-sm-6 text-left text-center">
                    <h3>_______________________________</h3>
                    <h5>CUSTOMERS NAME AND SIGNATURE</h5>
                </div>
                <div class="col-sm-6 text-end text-center">
                    <h3>______________________</h3>
                    <h5>CSO OFFICER</h5>
                </div>
            </div>
                </body>
            </head>
        </html>`;
        const printWindow = window.open('', '_blank', 'width=1200,height=800,top=' + (screen.height / 2 - 300) + ',left=' + (screen.width / 2 - 400));
        printWindow.document.write(content);
        const script = printWindow.document.createElement('script');
        script.src = extraScripts;
        script.onload = function () {
            printWindow.print();
            printWindow.close();
        };
        printWindow.document.body.appendChild(script);

    }
}
