<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import FireArmsService from '@/service/FireArmsService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';

const toast = useToast();

const firearms_data = ref(null);
const firearmDialog = ref(false);
const deletefirearmDialog = ref(false);
const deletefirearmsDialog = ref(false);
const firearm = ref({});
const selectedFireArms = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const firearmService = new FireArmsService();
const user = ref(null);
const store = useStore();
const personneldata = ref([null]);

onBeforeMount(() => {
    initFilters();
});

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
const canEdit = computed(() => hasPermission('personnels:edit', store.state.currentUserRole, store.state.roles));

onMounted(async () => {
    try {
        const data = await firearmService.getFireArms();
        const personnels = await firearmService.getPersonnels();
        firearms_data.value = data;
        personneldata.value = personnels;
        console.log(personneldata.value);
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
    submitted.value = false;
    firearmDialog.value = true;
};

const hideDialog = () => {
    firearmDialog.value = false;
    submitted.value = false;
};

const print = (printData) => {
    //joborderService.myPrintData(printData);
};

const saveFireArm = async () => {
    submitted.value = true;
    let { _id, firearms_serialno, firearms_qrcode, firearms, personnel_id } = firearm.value || {};

    if (!firearms_serialno || !firearms_qrcode || !firearms) {
        return null;
    }
    if (personnel_id === undefined) {
        personnel_id = null;
    } else {
        personnel_id = personnel_id.personnel_id;
    }

    if (_id) {
        const response = await axios.put(
            `/firearms/${_id}`,
            {
                _id,
                firearms_serialno,
                firearms_qrcode,
                firearms,
                personnel_id: personnel_id
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
        let index = firearms_data.value.findIndex((firearm) => firearm._id === _id);
        if (index > -1) {
            firearms_data.value[index] = firearm.value;
        }

        firearm.value.personnel_id = personnel_id;
        firearm.value = response.data;
        toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Personnel Updated',
            life: 3000
        });
    } else {
        firearms_serialno = generateID();
        const response = await axios.post(
            `/firearms`,
            {
                firearms_serialno,
                firearms_qrcode,
                firearms,
                personnel_id: personnel_id
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );

        firearm.value.personnel_id = personnel_id;
        firearm.value = response.data;
        firearms_data.value.push(firearm.value);

        toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Fire Arms Created',
            life: 3000
        });
    }

    firearmDialog.value = false;
    // Clear firearm.value
    firearm.value = {};
};

const editFireArms = (editFireArms) => {
    firearm.value = { ...editFireArms };
    console.log(firearm.value);
    const { _id, firearms_serialno, firearms_qrcode, personnel_id, firearms_isperson, firearms } = editFireArms;

    firearm.value = {
        _id,
        firearms_serialno,
        firearms_qrcode,
        firearms,
        personnel_id: { personnel_id: personnel_id },
        firearms_isperson
    };
    console.log(personnel_id);
    firearmDialog.value = true;
};

const confirmDelete = (editFireArms) => {
    firearm.value = editFireArms;
    deletefirearmDialog.value = true;
};

const deleteFireArms = async () => {
    let { _id, firearms_serialno } = firearm.value || {};
    const response = await axios.delete(`/firearms/${_id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (response.status === 200) {
        firearms_data.value = firearms_data.value.filter((val) => val.firearms_serialno !== firearms_serialno);
        deletefirearmDialog.value = false;
        firearm.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Fire Arms Deleted', life: 3000 });
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
            const response = await axios.delete(`/firearms/${firearm._id}`, {
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
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Fire Arms Deleted', life: 3000 });
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Fire Arms"
                        responsiveLayout="scroll"
                        :globalFilterFields="['firearms']"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Manage Fire Arms</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="firearms_serialno" header="Fire Arms Serial No." :sortable="true" headerStyle="width:25%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                {{ slotProps.data.firearms_serialno }}
                            </template>
                        </Column>
                        <Column field="firearms" header="Fire Arms" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                {{ slotProps.data.firearms }}
                            </template>
                        </Column>
                        <Column field="personnel_id" header="Personnel ID #" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms Serial No.</span>
                                {{ slotProps.data.personnel_id }}
                            </template>
                        </Column>
                        <Column field="firearms_qrcode" header="Fire Arms QR Code" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms QR Code</span>
                                {{ slotProps.data.firearms_qrcode }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Fire Arms" />
                            </template>
                        </Column>

                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" v-if="canEdit" class="p-button-rounded p-button-success mr-2" @click="editFireArms(slotProps.data)" />
                                <!--<Button icon="pi pi-print" v-if="canRead" class="p-button-rounded p-button-primary mt-2" @click="print(slotProps.data)" />-->
                                <Button icon="pi pi-trash" v-if="canDelete" class="p-button-rounded p-button-warning ml-2" @click="confirmDelete(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="firearmDialog" :style="{ width: '600px' }" header="Firearms Details" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="name">Firearms Serial No.</label>
                            <InputText id="firearms_serialno" v-model.trim="firearm.firearms_serialno" required="true" autofocus :class="{ 'p-invalid': submitted && !firearm.firearms_serialno }" />
                            <small class="p-invalid" v-if="submitted && !firearm.firearms_serialno">Full Name is required.</small>
                        </div>

                        <div class="field">
                            <label for="firearms">FireArms</label>
                            <InputText id="firearms" v-model.trim="firearm.firearms" required="true" rows="3" cols="20" :class="{ 'p-invalid': submitted && !firearm.firearms }" />
                            <small class="p-invalid" v-if="submitted && !firearm.firearms">Email is required.</small>
                        </div>

                        <div class="field">
                            <label for="firearms_qrcode">FireArms QR Code</label>
                            <InputText id="firearms_qrcode" v-model.trim="firearm.firearms_qrcode" required="true" rows="3" cols="20" :class="{ 'p-invalid': submitted && !firearm.firearms_qrcode }" />
                            <small class="p-invalid" v-if="submitted && !firearm.firearms_qrcode">Fire Arms QR Code is Required.</small>
                        </div>

                        <div class="field">
                            <label for="personnel_id">Personnel</label>
                            <Dropdown v-model.trim="firearm.personnel_id" :options="personneldata" optionLabel="personnel_id" placeholder="Select Personnel" />
                        </div>

                        <template #footer>
                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveFireArm" />
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
</style>
