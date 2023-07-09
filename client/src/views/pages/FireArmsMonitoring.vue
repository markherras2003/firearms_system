<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import FireArmsMonitoring from '@/service/FireArmsMonitoring';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const firearms_data = ref(null);
//const firearms_monitoringdata = ref(null);
const firearmDialog = ref(false);
const deletefirearmDialog = ref(false);
const deletefirearmsDialog = ref(false);
const firearm = ref({});
const selectedFireArms = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const firearmService = new FireArmsMonitoring();
const user = ref(null);
const store = useStore();
const personneldata = ref([null]);
const autoFilteredValue = ref([]);

//Generate Temporary Records

const temp_id = ref('');
const check_firearm_data_log = ref([null]);
const checkstatus = ref('');
const isFirearms = ref(false);
const check_firearm_data = ref([null]);
const my_firearm = ref('');
const my_availability = ref(false);
const personnel_fullname = ref('');
const my_firearm_isperson = ref(false);
const my_checkin = ref('');
const my_checkout = ref('');
const select_personnel_id = ref('');

onBeforeMount(() => {
    initFilters();
});

const fullnameField = computed(() => (option) => option.fullname + '-' + option.personnel_id);

function getFullName(personnelId) {
    const selectedPersonnel = personneldata.value.find((person) => person.personnel_id === personnelId);
    return selectedPersonnel ? selectedPersonnel.fullname : 'No Personnel';
}

const hasPermission = (permission, currentUserRole, roles) => {
    const role = roles.find((r) => r.name === currentUserRole);
    if (!role) return false;
    const permissions = role.permissions;
    if (!permissions) return false;
    return permissions.includes(permission);
};

// usage of permissions:
const canRead = computed(() => hasPermission('personnels:read', store.state.currentUserRole, store.state.roles));
const canWrite = computed(() => hasPermission('personnels:write', store.state.currentUserRole, store.state.roles));
const canDelete = computed(() => hasPermission('personnels:delete', store.state.currentUserRole, store.state.roles));
//const canEdit = computed(() => hasPermission('personnels:edit', store.state.currentUserRole, store.state.roles));

onMounted(async () => {
    try {
        const data = await firearmService.getFireArmsMonitoring();
        const personnels = await firearmService.getPersonnels();

        //const firearms_monitoring = await firearmService.getFireArmsMonitoring();
        firearms_data.value = data;
        console.log(firearms_data);
        personneldata.value = personnels;
        const response = await axios.get(`/users/${localStorage.getItem('_id')}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        user.value = response.data;
    } catch (error) {
        console.error(error);
    }
});

const openNew = () => {
    firearm.value = {};
    isFirearms.value = false;
    submitted.value = false;
    firearmDialog.value = true;
};

const hideDialog = () => {
    firearmDialog.value = false;
    submitted.value = false;
    setTimeout(() => {
        window.location.reload();
    }, 300);
};

const checkFirearms = async (data) => {
    const firearms_datas = await firearmService.getFireArmsID(data);
    check_firearm_data.value = firearms_datas;
    let { _id, firearms_serialno, firearms, firearms_availability, personnel, firearms_monitor, firearms_isperson, personnel_id } = check_firearm_data.value[0] || {};
    temp_id.value = data;
    my_checkin.value = null;
    my_checkout.value = null;
    personnel_fullname.value = null;

    if (!firearms_serialno) {
        isFirearms.value = false;
        toast.add({
            severity: 'error',
            summary: 'Firearms Does not Exist',
            detail: 'Not Exist',
            life: 3000
        });
        return null;
    } else {
        my_firearm_isperson.value = true;
        isFirearms.value = true;
        my_firearm.value = firearms;
        my_availability.value = firearms_availability;
        if (firearms_availability) {
            checkstatus.value = 'Check Out';
        } else {
            checkstatus.value = 'Check In';
        }

        if (personnel != null) {
            personnel_fullname.value = personnel.fullname != '' ? personnel.fullname : 'No Personnel';
            my_firearm_isperson.value = true;
        } else {
            if (firearms_monitor) {
                if (personnel_id === null) {
                    personnel_id = firearms_monitor.personnel_id;
                    const fname = getFullName(personnel_id);
                    personnel_fullname.value = fname;
                    my_firearm_isperson.value = true;
                }
            } else {
                personnel_fullname.value = 'No Personnel';
                my_firearm_isperson.value = false;
            }
        }

        if (firearms_monitor != null) {
            const checkInDate = firearms_monitor.check_in ? new Date(firearms_monitor.check_in) : null;
            const checkOutDate = firearms_monitor.check_out ? new Date(firearms_monitor.check_out) : null;
            const formattedCheckIn = checkInDate ? checkInDate.toLocaleString() : "";
            const formattedCheckOut = checkOutDate ? checkOutDate.toLocaleString() : "";
            
            my_checkin.value = formattedCheckIn;
            my_checkout.value = formattedCheckOut;
        }
    }
};

const logFirearms = async (data) => {
    const firearms_datas = await firearmService.getFireArmsID(data);
    check_firearm_data.value = firearms_datas;
    let { _id, firearms_serialno, firearms_id, firearms_qrcode, firearms, firearms_availability, personnel, firearms_monitor, personnel_id } = check_firearm_data.value[0] || {};
    temp_id.value = _id;

    console.log(firearms_datas);
    if (personnel_id === null) {
        const dd = select_personnel_id.value;
        console.log(dd);
        if (firearms_monitor === null) {
            if (dd === '') {
                toast.add({
                    severity: 'error',
                    summary: 'Please Select Personnel to proceed',
                    detail: '',
                    life: 3000
                });
                return null;
            } else {
                personnel_id = dd.personnel_id;
                console.log(personnel_id.value);
            }
        }
    }

    if (firearms_monitor === null) {
        const checkInDate = new Date();
        const checkOutDate = new Date();

        const formattedCheckIn = checkInDate ? checkInDate.toLocaleString() : '';
        const formattedCheckOut = checkOutDate ? checkOutDate.toLocaleString() : '';

        console.log('Insert New Record');
        const response = await axios.post(
            `/firearmsmonitoring`,
            {
                firearms_serialno,
                firearms_qrcode,
                firearms_id,
                personnel_id,
                check_in: !firearms_availability ? formattedCheckIn : null,
                check_out: firearms_availability ? formattedCheckOut : null
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );

        if (response) {
            let set_val = false;
            if (firearms_availability) {
                set_val = false;
            } else {
                set_val = true;
                console.log('Move to logs');
                const firearms_datas_log = await firearmService.getFireArmsID(data);
                check_firearm_data.value = firearms_datas_log;
                let { _id, firearms_serialno, firearms_id, firearms_qrcode, firearms, firearms_availability, personnel, firearms_monitor, personnel_id } = check_firearm_data.value[0] || {};
                console.log(firearms_datas_log);

                if (personnel_id === null) {
                    personnel_id = firearms_monitor.personnel_id;
                }

                const response = await axios.post(
                    `firearmsmonitoringlog`,
                    {
                        firearms_serialno,
                        firearms_qrcode,
                        firearms_id,
                        personnel_id,
                        check_in: firearms_monitor.check_in,
                        check_out: firearms_monitor.check_out
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                );

                console.log(_id);

                setTimeout(() => {
                    const response_delete = axios.delete(`/firearmsmonitoring/${firearms_monitor._id}`, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                    router.push('/pages/firearmsmonitoringlog');
                }, 1000);
            }
            const response = await axios.put(
                `firearms/setavailability/${_id}`,
                {
                    firearms_availability: set_val
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
        }
        toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Fire Arms Created',
            life: 3000
        });
        setTimeout(() => {
            checkFirearms(firearms_serialno);
        }, 500);
    } else {
        let response;
        let _id = firearms_monitor._id;
        console.log('Update');
        const checkInDate = new Date();
        const checkOutDate = new Date();
        const formattedCheckIn = checkInDate ? checkInDate.toLocaleString() : '';
        const formattedCheckOut = checkOutDate ? checkOutDate.toLocaleString() : '';
        const f_status = firearms_availability;

        if (f_status) {
            const response = await axios.put(
                `/firearmsmonitoring/${_id}`,
                {
                    check_out: f_status ? formattedCheckOut : null
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );

            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Check Out successfully',
                life: 3000
            });
        } else {
            const response = await axios.put(
                `/firearmsmonitoring/${_id}`,
                {
                    check_in: !f_status ? formattedCheckIn : null
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );

            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Check In successfully',
                life: 3000
            });

            console.log('Move to logs');

                const firearms_datas_logs = await firearmService.getFireArmsID(data);
                check_firearm_data_log.value = firearms_datas_logs;
                let {firearms_serialno, firearms_id, firearms_qrcode, firearms, firearms_availability, personnel, firearms_monitor, personnel_id } = check_firearm_data_log.value[0] || {};
                console.log(firearms_datas_logs);
            

            if (personnel_id === null) {
                personnel_id = firearms_monitor.personnel_id;
            }

            const response2 = await axios.post(
                `firearmsmonitoringlog`,
                {
                    firearms_serialno,
                    firearms_qrcode,
                    firearms_id,
                    personnel_id,
                    check_in: firearms_monitor.check_in,
                    check_out: firearms_monitor.check_out
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );


                const response_delete = await axios.delete(`/firearmsmonitoring/${firearms_monitor._id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
                setTimeout(() => {
                    router.push('/pages/firearmsmonitoringlog');
                }, 1500);
        }

        let set_val = false;
        if (firearms_availability) {
            set_val = false;
        } else {
            set_val = true;
        }
        const response2 = await axios.put(
            `firearms/setavailability/${temp_id.value}`,
            {
                firearms_availability: set_val
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );

        setTimeout(() => {
            checkFirearms(firearms_serialno);
        }, 500);
    }
};

const confirmDelete = (editFireArms) => {
    firearm.value = editFireArms;
    deletefirearmDialog.value = true;
};

const deleteFireArms = async () => {
    let { _id, firearms_serialno } = firearm.value || {};
    const response = await axios.delete(`/firearmsmonitoring/${_id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (response.status === 200) {
        firearms_data.value = firearms_data.value.filter((val) => val.firearms_serialno !== firearms_serialno);
        deletefirearmDialog.value = false;
        firearm.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Fire Arms Monitoring Deleted', life: 3000 });
    }
};

function generateID() {
    const lastID = firearms_data.value.length ? firearms_data.value[firearms_data.value.length - 1].firearms_serialno : 0;
    return lastID + 1;
}

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deletefirearmsDialog.value = true;
};

const deleteSelectedFireArms = async () => {
    try {
        // Loop through each selected job order and send a DELETE request
        for (const firearm of selectedFireArms.value) {
            const response = await axios.delete(`/firearmsmonitoring/${firearm._id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (response.status === 200) {
                // Remove the deleted job order from the joborders array
                firearms_data.value = firearms_data.value.filter((val) => val.firearms_serialno !== firearm.firearms_serialno);
            }
        }
        // Clear the selected job orders and display a success toast notification
        selectedFireArms.value = null;
        deletefirearmsDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Fire Arms Monitoring Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Fire Arms', life: 3000 });
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firearms: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

const searchPersonnel = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...personneldata.value];
        } else {
            autoFilteredValue.value = personneldata.value.filter((person) => String(person.fullname).toLowerCase().startsWith(event.query.toLowerCase()));
        }
    }, 250);
};
</script>

<template>
    <div id="joborder">
        <div v-if="!canRead">
            <AccessDenied></AccessDenied>
        </div>
        <div class="grid" v-if="canRead">
            <div class="col-12">
                <div class="card">
                    <Toast />
                    <Toolbar class="mb-4">
                        <template v-slot:start>
                            <div class="my-2">
                                <Button v-if="canWrite" label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                                <Button v-if="canDelete" label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedFireArms || !selectedFireArms.length" />
                            </div>
                        </template>

                        <template v-slot:end>
                            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>

                    <DataTable
                        ref="dt"
                        :value="firearms_data"
                        v-model:selection="selectedFireArms"
                        dataKey="_id"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        v-model:filters="filters"
                        filterDisplay="menu"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Fire Arms Monitoring"
                        responsiveLayout="scroll"
                        :globalFilterFields="['firearms_serialno','fire_arms.firearms','personnel.fullname']"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Manage Fire Arms Monitoring</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="firearms_monitor_id" header="Fire Arms Monitor ID." :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms Monitor ID.</span>
                                {{ slotProps.data.firearms_monitor_id }}
                            </template>
                        </Column>
                        <Column field="firearms_serialno" header="Fire Arms Serial No." :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                {{ slotProps.data.firearms_serialno }}
                            </template>
                        </Column>
                        <Column field="firearms" header="Fire Arms" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                {{ slotProps.data.fire_arms.firearms }}
                            </template>
                        </Column>
                        <Column field="personnel_id" header="Personnel" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Personnel</span>
                                {{ slotProps.data.personnel.fullname }}
                            </template>
                        </Column>
                        <Column field="check_in" header="Check In" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Check In</span>
                                {{ slotProps.data.check_in }}
                            </template>
                        </Column>
                        <Column field="check_out" header="Check Out" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Check Out</span>
                                {{ slotProps.data.check_out }}
                            </template>
                        </Column>

                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <!--<Button icon="pi pi-print" v-if="canRead" class="p-button-rounded p-button-primary mt-2" @click="print(slotProps.data)" />-->
                                <Button icon="pi pi-trash" v-if="canDelete" class="p-button-rounded p-button-warning ml-2" @click="confirmDelete(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="firearmDialog" :style="{ width: '800px' }" header="Firearms Details" :modal="true" class="p-fluid" :closable="false">
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="name"></label>
                                <InputText id="firearms_serialno" placeholder="Firearms Serial No." v-model.trim="firearm.firearms_serialno" required="true" autofocus :class="{ 'p-invalid': submitted && !firearm.firearms_serialno }" />
                                <small class="p-invalid" v-if="submitted && !firearm.firearms_serialno">Full Name is required.</small>
                            </div>

                            <div class="field col">
                                <button @click="checkFirearms(firearm.firearms_serialno)" class="p-button p-component" type="button" aria-label="Submit">
                                    <span class="p-button-label">Check Firearms</span>
                                    <span class="p-ink" role="presentation" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div class="field col" v-if="isFirearms">
                                <button :disabled="!isFirearms" @click="logFirearms(firearm.firearms_serialno)" class="p-button p-component" type="button" aria-label="Submit">
                                    <span class="p-button-label">{{ checkstatus }}</span>
                                    <span class="p-ink" role="presentation" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>

                        <div v-if="isFirearms" class="field">
                            <span class="block text-600 font-medium mb-3"
                                ><strong>Firearms : {{ my_firearm }}</strong></span
                            >
                            <span>
                                Availability :
                                <Tag class="mr-4" :severity="my_availability ? 'success' : 'danger'"> {{ my_availability ? 'Yes' : 'Not Available' }}</Tag>
                            </span>
                            <div class="mt-3">
                                <Chip :label="personnel_fullname" :image="'demo/images/avatar/default.jpg'" class="mr-2 mb-2"></Chip>
                            </div>
                            <div class="field" v-if="!my_firearm_isperson">
                                <!--<Dropdown v-model.trim="firearm.personnel_id" :options="personneldata" optionLabel="personnel_id" placeholder="Select Personnel" />-->
                                <AutoComplete
                                    placeholder="Search Personnel"
                                    id="dd"
                                    :dropdown="true"
                                    :multiple="false"
                                    v-model="select_personnel_id"
                                    :options="personneldata"
                                    :suggestions="autoFilteredValue"
                                    @complete="searchPersonnel($event)"
                                    :field="fullnameField"
                                />
                                <strong v-if="firearm.personnel_id">Personnel: {{ getFullName(firearm.personnel_id) }}</strong>
                            </div>
                            <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                                <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                                    <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                        <i class="pi pi-clock text-xl text-green-500"></i>
                                    </div>
                                    <span class="text-900 line-height-3">
                                        <span class="text-700">Check In: {{ my_checkin }}</span>
                                    </span>
                                </li>
                                <li class="flex align-items-center py-2">
                                    <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                        <i class="pi pi-clock text-xl text-blue-500"></i>
                                    </div>
                                    <span class="text-700 line-height-3"
                                        ><span class="text-700"> Check Out : {{ my_checkout }}</span></span
                                    >
                                </li>
                            </ul>
                        </div>

                        <template #footer>
                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deletefirearmDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="firearm"
                                >Are you sure you want to deletes <b>{{ firearm.firearms }}</b
                                >?</span
                            >
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletefirearmDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteFireArms" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deletefirearmsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="firearm">Are you sure you want to delete the selected firearms?</span>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletefirearmsDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedFireArms" />
                        </template>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
.p-dialog .p-dialog-header-icon { display: none!important; }
</style>
