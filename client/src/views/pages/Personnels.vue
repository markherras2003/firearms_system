<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import PersonnelService from '@/service/PersonnelService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';

const toast = useToast();

const personnels = ref(null);
const personnelDialog = ref(false);
const deletepersonnelDialog = ref(false);
const deletepersonnelssDialog = ref(false);
const personnel = ref({});
const selectedPersonnels = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const personnelService = new PersonnelService();
const user = ref(null);
const store = useStore();
const ranksdata = ref([]);
const svcdata = ref([]);
const personnelofficedata = ref([]);

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
        const data = await personnelService.getPersonnels();
        const ranks = await personnelService.getPersonnelsRank();
        const svc = await personnelService.getPersonnelsSVC();
        const personneloffice = await personnelService.getPersonnelOffice();
        personnels.value = data;
        ranksdata.value = ranks;
        svcdata.value = svc;
        personnelofficedata.value = personneloffice;
        console.log(data);
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
    personnel.value = {};
    submitted.value = false;
    personnelDialog.value = true;
};

const hideDialog = () => {
    personnelDialog.value = false;
    submitted.value = false;
};

const print = (printData) => {
    //joborderService.myPrintData(printData);
};

const savePersonnel = async () => {
    console.log(personnel.value);
    submitted.value = true;
    let {
        _id,
        personnel_id,
        serial_no,
        fullname,
        personnel_contact,
        personnel_rank: { personnel_rank: personnel_rank } = {},
        personnel_brsvc: { personnel_brsvc: personnel_brsvc } = {},
        personnel_office: { personnel_office: personnel_office } = {},
        personnel_email } = personnel.value || {};

        console.log(personnel_email);

        if(personnel_email===undefined) {
            personnel_email = '';
        }

    if (!fullname || !serial_no) {
        return null;
    }

    if (_id) {
        const response = await axios.put(
            `/personnel/${_id}`,
            {
                _id,
                personnel_id,
                serial_no,
                fullname,
                personnel_rank,
                personnel_brsvc,
                personnel_office,
                personnel_contact,
                personnel_email
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
        let index = personnels.value.findIndex((personnel) => personnel._id === _id);
        if (index > -1) {
            personnels.value[index] = personnel.value;
        }
        personnel.value.personnel_rank = personnel_rank;
        personnel.value.personnel_brsvc = personnel_brsvc;
        personnel.value.personnel_office = personnel_office;
        personnel.value = response.data;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Personnel Updated', life: 3000 });
    } else {
        personnel_id = generateID();
        try {
            const response = await axios.post(
                `/personnel`,
                {
                    personnel_id,
                    serial_no,
                    fullname,
                    personnel_rank,
                    personnel_brsvc,
                    personnel_office,
                    personnel_contact,
                    personnel_email
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
            personnel.value = response.data;
            personnels.value.push(personnel.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Personnel Created', life: 3000 });
        } catch (error) {
            if (error.response && error.response.status === 500 && error.response.data.error.includes('duplicate')) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Personnel with the same serial number already exists', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create personnel', life: 3000 });
            }
        }
    }
    personnelDialog.value = false;
    personnel.value = {};
};

const editPersonnel = (editPersonnel) => {
    personnel.value = { ...editPersonnel };
    const {
        _id,
        personnel_id,
        fullname,
        serial_no,
        personnel_rank,
        personnel_brsvc,
        personnel_office,
        personnel_contact,
        personnel_email } = editPersonnel;
    personnel.value = {
        _id,
        fullname,
        personnel_id,
        serial_no,
        personnel_contact,
        personnel_rank: { personnel_rank: personnel_rank },
        personnel_brsvc: { personnel_brsvc: personnel_brsvc },
        personnel_office: { personnel_office: personnel_office },
        personnel_email,
    };
    console.log(personnel.value);
    personnelDialog.value = true;
};

const confirmDeletePersonnel = (editPersonnel) => {
    personnel.value = editPersonnel;
    deletepersonnelDialog.value = true;
};

const deletePersonnel = async () => {
    let { _id, personnel_id } = personnel.value || {};
    const response = await axios.delete(`/personnel/${_id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (response.status === 200) {
        personnels.value = personnels.value.filter((val) => val.personnel_id !== personnel_id);
        deletepersonnelDialog.value = false;
        personnel.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Personnel Deleted', life: 3000 });
    }
};

function generateID() {
    const lastID = personnels.value.length ? personnels.value[personnels.value.length - 1].personnel_id : 0;
    return lastID + 1;
}

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deletepersonnelssDialog.value = true;
};

const deleteSelectedPersonnel = async () => {
    try {
        // Loop through each selected job order and send a DELETE request
        for (const personnel of selectedPersonnels.value) {
            const response = await axios.delete(`/personnel/${personnel._id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (response.status === 200) {
                // Remove the deleted job order from the joborders array
                personnels.value = personnels.value.filter((val) => val.personnel_id !== personnel.personnel_id);
            }
        }
        // Clear the selected job orders and display a success toast notification
        selectedPersonnels.value = null;
        deletepersonnelssDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Personnels Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Personnels', life: 3000 });
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fullname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
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
                                <Button v-if="canWrite" label="New" icon="pi pi-plus" class="p-button-success mr-2"
                                    @click="openNew" />
                                <Button v-if="canDelete" label="Delete" icon="pi pi-trash" class="p-button-danger"
                                    @click="confirmDeleteSelected"
                                    :disabled="!selectedPersonnels || !selectedPersonnels.length" />
                            </div>
                        </template>

                        <template v-slot:end>
                            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>

                    <DataTable ref="dt" :value="personnels" v-model:selection="selectedPersonnels" dataKey="_id"
                        :paginator="true" :rows="10" :filters="filters" v-model:filters="filters" filterDisplay="menu"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Personnels"
                        responsiveLayout="scroll" :globalFilterFields="['fullname', 'serial_no', 'personnel_id']">
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Manage Personnels</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                        <!-- Series Count Column -->
                        <Column field="series_count" header="#">
                            <template #body="slotProps">
                                <span class="p-column-title">#</span>
                                {{ slotProps.data.series_count }}
                            </template>
                        </Column>

                        <Column field="serial_no" header="AFP Serial No." :sortable="true"
                            headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">AFP Serial No.</span>
                                {{ slotProps.data.serial_no }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                    placeholder="Search by Serial No." />
                            </template>
                        </Column>
                        <Column field="fullname" header="Full Name" :sortable="true"
                            headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Full Name</span>
                                {{ slotProps.data.fullname }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                    placeholder="Search by fullname" />
                            </template>
                        </Column>
                        <Column field="personnel_email" header="Email" :sortable="true"
                            headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Email</span>
                                {{ slotProps.data.personnel_email }}
                            </template>
                        </Column>

                        <Column field="personnel_contact" header="Contact" :sortable="true"
                            headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Contact</span>
                                {{ slotProps.data.personnel_contact }}
                            </template>
                        </Column>


                        <Column field="personnel_office" header="Office" :sortable="true"
                            headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Office</span>
                                {{ slotProps.data.personnel_office }}
                            </template>
                        </Column>

                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" v-if="canEdit" class="p-button-rounded p-button-success mr-2"
                                    @click="editPersonnel(slotProps.data)" />
                                <!--<Button icon="pi pi-print" v-if="canRead" class="p-button-rounded p-button-primary mt-2" @click="print(slotProps.data)" />-->
                                <Button icon="pi pi-trash" v-if="canDelete" class="p-button-rounded p-button-warning ml-2"
                                    @click="confirmDeletePersonnel(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="personnelDialog" :style="{ width: '600px' }" header="Personnel Details"
                        :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="name">AFP Serial No.</label>
                            <InputText id="serial_no" v-model.trim="personnel.serial_no" required="true" autofocus
                                :class="{ 'p-invalid': submitted && !personnel.serial_no }" />
                            <small class="p-invalid" v-if="submitted && !personnel.serial_no">Serial No. is
                                required.</small>
                        </div>
                        <div class="field">
                            <label for="name">Fullname (RANK/NAME/BOS)</label>
                            <InputText id="fullname" v-model.trim="personnel.fullname" required="true" autofocus
                                :class="{ 'p-invalid': submitted && !personnel.fullname }" />
                            <small class="p-invalid" v-if="submitted && !personnel.fullname">Full Name is required.</small>
                        </div>
                        <div class="field">
                            <label for="personnel_email">Email</label>
                            <InputText id="personnel_email" v-model.trim="personnel.personnel_email" required="false"
                                rows="3" cols="20" />
                        </div>

                        <div class="field">
                            <label for="name">Contact#</label>
                            <InputText id="contact" v-model.trim="personnel.personnel_contact" required="true" autofocus />
                        </div>

                        <div class="field">
                            <label for="personnel_brsvc">Office</label>
                            <Dropdown v-model="personnel.personnel_office" :options="personnelofficedata"
                                optionLabel="personnel_office" placeholder="Select Office" />
                        </div>

                        <template #footer>
                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePersonnel" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deletepersonnelDialog" :style="{ width: '450px' }" header="Confirm"
                        :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="personnel">Are you sure you want to delete <b>{{ personnel.fullname }}</b>?</span>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text"
                                @click="deletepersonnelDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePersonnel" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deletepersonnelssDialog" :style="{ width: '450px' }" header="Confirm"
                        :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="personnel">Are you sure you want to delete the selected personnels?</span>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text"
                                @click="deletepersonnelssDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPersonnel" />
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
