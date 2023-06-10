<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import JobOrderService from '@/service/JobOrderService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';

const toast = useToast();

const joborders = ref(null);
const joborderDialog = ref(false);
const deleteJobOrderDialog = ref(false);
const deleteJobOrdersDialog = ref(false);
const joborder = ref({});
const selectedJobOrders = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const joborderService = new JobOrderService();
const user = ref(null);
const store = useStore();

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
const canRead = computed(() => hasPermission('joborders:read', store.state.currentUserRole, store.state.roles));
const canWrite = computed(() => hasPermission('joborders:write', store.state.currentUserRole, store.state.roles));
const canDelete = computed(() => hasPermission('joborders:delete', store.state.currentUserRole, store.state.roles));
const canEdit = computed(() => hasPermission('joborders:edit', store.state.currentUserRole, store.state.roles));

onMounted(async () => {
    try {
        const data = await joborderService.getJobOrders();
        joborders.value = data;
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
    joborder.value = {};
    submitted.value = false;
    joborderDialog.value = true;
};

const hideDialog = () => {
    joborderDialog.value = false;
    submitted.value = false;
};

const print = (printData) => {
    joborderService.myPrintData(printData);
};

const saveJobOrder = async () => {
    submitted.value = true;

    let { id, job_id, client_name, unit_description, unit_model, unit_accessories, unit_problem, resolution, received_by, job_order_by, tech_incharge, phone_no } = joborder.value || {};

    if (!client_name && !client_name.trim()) {
        return null;
    }

    if (id) {
        const response = await axios.put(
            `/joborder/${id}`,
            {
                id,
                client_name,
                unit_description,
                unit_model,
                unit_accessories,
                unit_problem,
                resolution,
                received_by,
                job_order_by,
                tech_incharge,
                phone_no
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
        let index = joborders.value.findIndex((job) => job.job_id === job_id);
        if (index > -1) {
            joborders.value[index] = joborder.value;
        }
        joborder.value = response.data;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Order Updated', life: 3000 });
    } else {
        job_id = generateJobOrderID();
        const response = await axios.post(
            `/joborder`,
            {
                job_id,
                client_name,
                unit_description,
                unit_model,
                unit_accessories,
                unit_problem,
                resolution,
                received_by,
                job_order_by,
                tech_incharge,
                phone_no
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
        // Set joborder.value to response data
        joborder.value = response.data;
        joborder.value.id = joborder.value._id;
        joborders.value.push(joborder.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Order Created', life: 3000 });
    }
    joborderDialog.value = false;
    // Clear joborder.value
    joborder.value = {};
};

const editJobOrder = (editJobOrder) => {
    joborder.value = { ...editJobOrder };
    joborderDialog.value = true;
};

const confirmDeleteJobOrder = (editJobOrder) => {
    joborder.value = editJobOrder;
    deleteJobOrderDialog.value = true;
};

const deleteJobOrder = async () => {
    let { id, job_id } = joborder.value || {};
    const response = await axios.delete(`/joborder/${id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (response.status === 200) {
        joborders.value = joborders.value.filter((val) => val.job_id !== job_id);
        deleteJobOrderDialog.value = false;
        joborder.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Order Deleted', life: 3000 });
    }
};

function generateJobOrderID() {
    const lastID = joborders.value.length ? joborders.value[joborders.value.length - 1].job_id : 0;
    return lastID + 1;
}

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteJobOrdersDialog.value = true;
};

const deleteSelectedJobOrders = async () => {
    try {
        // Loop through each selected job order and send a DELETE request
        for (const jobOrder of selectedJobOrders.value) {
            const response = await axios.delete(`/joborder/${jobOrder.id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (response.status === 200) {
                // Remove the deleted job order from the joborders array
                joborders.value = joborders.value.filter((val) => val.job_id !== jobOrder.job_id);
            }
        }
        // Clear the selected job orders and display a success toast notification
        selectedJobOrders.value = null;
        deleteJobOrdersDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Orders Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete job orders', life: 3000 });
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        client_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
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
                                <Button v-if="canDelete" label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedJobOrders || !selectedJobOrders.length" />
                            </div>
                        </template>

                        <template v-slot:end>
                            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>

                    <DataTable
                        ref="dt"
                        :value="joborders"
                        v-model:selection="selectedJobOrders"
                        dataKey="id"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        v-model:filters="filters"
                        filterDisplay="menu"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Job Orders"
                        responsiveLayout="scroll"
                        :globalFilterFields="['client_name', 'job_id']"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Manage Job Orders</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="job_id" header="Job Order #" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Job Order #</span>
                                {{ slotProps.data.job_id }}
                            </template>
                        </Column>
                        <Column field="client_name" header="Client Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Client Name</span>
                                {{ slotProps.data.client_name }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                            </template>
                        </Column>
                        <Column field="unit_description" header="Unit Description" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Unit Description</span>
                                {{ slotProps.data.unit_description }}
                            </template>
                        </Column>
                        <Column field="unit_model" header="Unit Model" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Unit Model</span>
                                {{ slotProps.data.unit_model }}
                            </template>
                        </Column>
                        <Column field="unit_accessories" header="Unit Accessories" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Unit Accessories</span>
                                {{ slotProps.data.unit_accessories }}
                            </template>
                        </Column>
                        <Column field="unit_problem" header="Unit Problem" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Unit Accessories</span>
                                {{ slotProps.data.unit_accessories }}
                            </template>
                        </Column>
                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" v-if="canEdit" class="p-button-rounded p-button-success mr-2" @click="editJobOrder(slotProps.data)" />
                                <Button icon="pi pi-print" v-if="canRead" class="p-button-rounded p-button-primary mt-2" @click="print(slotProps.data)" />
                                <Button icon="pi pi-trash" v-if="canDelete" class="p-button-rounded p-button-warning ml-2" @click="confirmDeleteJobOrder(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="joborderDialog" :style="{ width: '600px' }" header="Job Order Details" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="name">Client Name</label>
                            <InputText id="client_name" v-model.trim="joborder.client_name" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.client_name }" />
                            <small class="p-invalid" v-if="submitted && !joborder.client_name">Client Name is required.</small>
                        </div>
                        <div class="field">
                            <label for="unit_description">Description</label>
                            <Textarea id="unit_description" v-model="joborder.unit_description" required="true" rows="3" cols="20" />
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="unit_model">Unit Model </label>
                                <InputText id="unit_model" v-model.trim="joborder.unit_model" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.unit_model }" />
                                <small class="p-invalid" v-if="submitted && !joborder.unit_model">Unit Model is required.</small>
                            </div>

                            <div class="field col">
                                <label for="unit_accessories">Unit Accessories </label>
                                <InputText id="unit_accessories" v-model.trim="joborder.unit_accessories" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.unit_accessories }" />
                                <small class="p-invalid" v-if="submitted && !joborder.unit_accessories">Unit Accessories is required.</small>
                            </div>
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="unit_problem">Unit Problem</label>
                                <Textarea id="unit_problem" v-model="joborder.unit_problem" required="true" rows="3" cols="20" />
                            </div>
                            <div class="field col">
                                <label for="phone_no">Phone No.</label>
                                <InputText id="phone_no" v-model.trim="joborder.phone_no" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.phone_no }" />
                                <small class="p-invalid" v-if="submitted && !joborder.phone_no">Received by is required.</small>
                            </div>
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="resolution">Resolution </label>
                                <InputText id="resolution" v-model.trim="joborder.resolution" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.resolution }" />
                                <small class="p-invalid" v-if="submitted && !joborder.resolution">Resolution is required.</small>
                            </div>

                            <div class="field col">
                                <label for="received_by">Received By</label>
                                <InputText id="received_by" v-model.trim="joborder.received_by" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.received_by }" />
                                <small class="p-invalid" v-if="submitted && !joborder.received_by">Received by is required.</small>
                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="job_order_by">Job Order By</label>
                                <InputText id="job_order_by" v-model.trim="joborder.job_order_by" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.job_order_by }" />
                                <small class="p-invalid" v-if="submitted && !joborder.job_order_by">Job Order By is required.</small>
                            </div>

                            <div class="field col">
                                <label for="tech_incharge">Tech incharge</label>
                                <InputText id="tech_incharge" v-model.trim="joborder.tech_incharge" required="true" autofocus :class="{ 'p-invalid': submitted && !joborder.tech_incharge }" />
                                <small class="p-invalid" v-if="submitted && !joborder.tech_incharge">Tech incharge is required.</small>
                            </div>
                        </div>

                        <template #footer>
                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveJobOrder" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deleteJobOrderDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="joborder"
                                >Are you sure you want to delete <b>{{ joborder.client_name }}</b
                                >?</span
                            >
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteJobOrderDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteJobOrder" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deleteJobOrdersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="joborder">Are you sure you want to delete the selected job orders?</span>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteJobOrdersDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedJobOrders" />
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
