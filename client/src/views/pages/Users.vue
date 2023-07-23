<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import UserService from '@/service/UserService';
import RoleService from '@/service/RoleService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';

const toast = useToast();

const cruddatas = ref(null);
const crudDialog = ref(false);
const deletecrudDialog = ref(false);
const deletecrudsDialog = ref(false);
const cruddata = ref({});
const selectedCruds = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const userService = new UserService();
const roleService = new RoleService();
const roledatas = ref([]);
const user = ref(null);
const confirmpassword = ref('');
const isMatchPassword = ref(false);
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
const canRead = computed(() => hasPermission('users:read', store.state.currentUserRole, store.state.roles));
const canWrite = computed(() => hasPermission('users:write', store.state.currentUserRole, store.state.roles));
const canDelete = computed(() => hasPermission('users:delete', store.state.currentUserRole, store.state.roles));
const canEdit = computed(() => hasPermission('users:edit', store.state.currentUserRole, store.state.roles));

onMounted(async () => {
    try {
        const data = await userService.getUsers();
        const role = await roleService.getRolename();
        cruddatas.value = data;
        roledatas.value = role;
        console.log(cruddatas.value);
        console.log(roledatas.value);
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
    cruddata.value = {};
    submitted.value = false;
    crudDialog.value = true;
};

const hideDialog = () => {
    crudDialog.value = false;
    submitted.value = false;
};

const saveData = async () => {
    submitted.value = true;
    try {

        let {
            _id,
            firstName,
            lastName,
            email,
            password,
            role: { name: roleName }
        } = cruddata.value || {};

        if (password !== confirmpassword.value) {
          isMatchPassword.value = true;
          return null;
        }     
        if (!firstName && !firstName.trim()) {
            return null;
        }

        if (_id) {
            const response = await axios.put(
                `/auth/users/${_id}`,
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    role: roleName
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
            let index = cruddatas.value.findIndex((crud) => crud._id === _id);
            if (index > -1) {
                cruddatas.value[index] = cruddata.value;
            }
            //Store response value to cruddata
            cruddata.value.role = roleName
            cruddata.value = response.data;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Updated', life: 3000 });
        } else {
            const response = await axios.post(
                `/auth/register`,
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    role: roleName
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
            //Store response value to cruddata
            cruddata.value = response.data;
            // update and push the cruddata value to cruddatas
            cruddatas.value.push(cruddata.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Created', life: 3000 });
        }
        isMatchPassword.value = false;
        crudDialog.value = false;
        cruddata.value = {};
    } catch (error) {
        if (error.response && error.response.status === 409) {
          // Email address already registered
          toast.add({ severity: 'error', summary: 'Conflict Error', detail: ' Email address already registered', life: 5000 });
        } else {
          // Unknown error occurred
          toast.add({ severity: 'error', summary: 'Conflict Error', detail: 'An unknown error occurred.', life: 5000 });
        }
    }
};

const editData = (editData) => {
    const { _id, firstName, lastName, email, password, role } = editData;
    cruddata.value = {
        _id,
        firstName,
        lastName,
        email,
        password,
        role: { name: role }
    };
    console.log(role);
    crudDialog.value = true;
};

const confirmDeleteData = (editData) => {
    cruddata.value = editData;
    deletecrudDialog.value = true;
};

const deleteData = async () => {
    let { _id, name } = cruddata.value || {};
    const response = await axios.delete(`/auth/users/${_id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (response.status === 200) {
        cruddatas.value = cruddatas.value.filter((val) => val._id !== _id);
        deletecrudDialog.value = false;
        cruddata.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    }
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deletecrudsDialog.value = true;
};

const deleteSelectedData = async () => {
    try {
        for (const dataCrud of selectedCruds.value) {
            const response = await axios.delete(`/auth/users/${dataCrud._id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (response.status === 200) {
                cruddatas.value = cruddatas.value.filter((val) => val._id !== dataCrud._id);
            }
        }
        selectedCruds.value = null;
        deletecrudsDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Users', life: 3000 });
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};
</script>

<template>
    <div id="users">
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
                                <Button v-if="canDelete" label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedCruds || !selectedCruds.length" />
                            </div>
                        </template>

                        <template v-slot:end>
                            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>

                    <DataTable
                        ref="dt"
                        :value="cruddatas"
                        v-model:selection="selectedCruds"
                        dataKey="_id"
                        :paginator="true"
                        :rows="25"
                        :filters="filters"
                        v-model:filters="filters"
                        filterDisplay="menu"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Job Orders"
                        responsiveLayout="scroll"
                        :globalFilterFields="['name', '_id']"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Manage Users</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="firstName" header="Firstname" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Firstname</span>
                                {{ slotProps.data.firstName }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                            </template>
                        </Column>

                        <Column field="lastName" header="Lastname" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Lastname</span>
                                {{ slotProps.data.lastName }}
                            </template>
                        </Column>

                        <Column field="email" header="Email" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Email</span>
                                {{ slotProps.data.email }}
                            </template>
                        </Column>

                        <Column field="role" header="Role" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Role</span>
                                {{ slotProps.data.role }}
                            </template>
                        </Column>

                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Button v-if="canEdit" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editData(slotProps.data)" />
                                <Button v-if="canDelete" icon="pi pi-trash" class="p-button-rounded p-button-warning ml-2" @click="confirmDeleteData(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="crudDialog" :style="{ width: '600px' }" header="User Account" :modal="true" class="p-fluid">
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="firstName">Firstname</label>
                                <InputText id="firstName" v-model.trim="cruddata.firstName" required="true" autofocus :class="{ 'p-invalid': submitted && !cruddata.firstName }" />
                                <small class="p-invalid mb-2" v-if="submitted && !cruddata.firstName">Firstname is required.</small>
                            </div>

                            <div class="field col">
                                <label for="lastName">Lastname</label>
                                <InputText id="lastName" v-model.trim="cruddata.lastName" required="true" autofocus :class="{ 'p-invalid': submitted && !cruddata.lastName }" />
                                <small class="p-invalid mb-2" v-if="submitted && !cruddata.lastName">Lastname is required.</small>
                            </div>
                        </div>

                        <div class="field">
                            <label for="email">Email</label>
                            <InputText id="email" v-model.trim="cruddata.email" required="true" autofocus :class="{ 'p-invalid': submitted && !cruddata.email }" />
                            <small class="p-invalid mb-2" v-if="submitted && !cruddata.email">Email is required.</small>
                        </div>

                        <div class="field">
                            <label for="role">Role</label>
                            <Dropdown v-model="cruddata.role" :options="roledatas" optionLabel="name" placeholder="Select" />
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="password">Password</label>
                                <Password id="password" v-model="cruddata.password" autofocus :class="{ 'p-invalid': submitted && !cruddata.password }" />
                                <small class="p-invalid mb-2" v-if="submitted && !cruddata.password">Password is required.</small>
                            </div>

                            <div class="field col">
                                <label for="confirmpassword">Confirm Password</label>
                                <Password id="confirmpassword" v-model="confirmpassword" :class="{ 'p-invalid': submitted && !confirmpassword }" />
                                <small class="p-invalid mb-2" v-if="submitted && !confirmpassword">Confirm Pasword is required.</small>
                                <small class="p-invalid mb-2" v-if="isMatchPassword">Password is not match.</small>
                            </div>
                        </div>

                        <template #footer>
                            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveData" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deletecrudDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="cruddata"
                                >Are you sure you want to delete <b>{{ cruddata.name }}</b
                                >?</span
                            >
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletecrudDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteData" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="deletecrudsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="cruddata">Are you sure you want to delete the selected job orders?</span>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletecrudsDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedData" />
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
