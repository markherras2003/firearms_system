<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import RoleService from '@/service/RoleService';
import PermissionService from '@/service/PermissionService';
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
const testdata = ref({});
const selectedCruds = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const rolesService = new RoleService();
const permissionService = new PermissionService();
const user = ref(null);
const myListbox = ref(null);
const myListbox2 = ref(null);
const selectedPermission = ref(null);
const selectedPermission2 = ref(null);
const isRolename = ref(false);
const multiselectValues = ref([]);
const autoValue = ref(null);
const store = useStore();
const repopulateAutoValue = ref(null);

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
const canRead = computed(() => hasPermission('roles:read', store.state.currentUserRole, store.state.roles));
const canWrite = computed(() => hasPermission('roles:write', store.state.currentUserRole, store.state.roles));
const canDelete = computed(() => hasPermission('roles:delete', store.state.currentUserRole, store.state.roles));
const canEdit = computed(() => hasPermission('roles:edit', store.state.currentUserRole, store.state.roles));

async function doSomething() {
    let { _id, name, permissions } = this.cruddata || {};
    if (!this.cruddata.permissions.includes(this.selectedPermission.name)) {
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Added Permission Successfully', life: 3000 });
        this.cruddata.permissions.push(this.selectedPermission.name);
        const autoValue = this.autoValue || []; // Ensure that autoValue is an array
        const names = autoValue.map((obj) => obj.name);
        const index = names.indexOf(this.selectedPermission.name);
        this.autoValue.splice(index, 1);
        const response = await axios.put(
            `/roles/${_id}`,
            {
                _id,
                name,
                permissions
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
    } else {
        toast.add({ severity: 'error', summary: 'Failed', detail: 'Existing Permission', life: 3000 });
    }
}

async function doSomething2() {
    let { _id, name, permissions } = this.cruddata || {};
    if (this.cruddata.permissions.includes(this.selectedPermission2)) {
        const index = this.cruddata.permissions.indexOf(this.selectedPermission2);
        this.cruddata.permissions.splice(index, 1);
        this.autoValue.push({ name:this.selectedPermission2});
        const response = await axios.put(
            `/roles/${_id}`,
            {
                _id,
                name,
                permissions
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Removed Permission Successfully', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Failed', detail: 'Permission not found', life: 3000 });
    }
}

onMounted(async () => {
    try {
        const data = await rolesService.getRoles();
        const permissions = await permissionService.getPermissions();
        repopulateAutoValue.value = permissions;
        autoValue.value = permissions;
        cruddatas.value = data;
        multiselectValues.value = permissions;
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
    isRolename.value = false;
    submitted.value = false;
    crudDialog.value = true;
};

const hideDialog = () => {
    crudDialog.value = false;
    submitted.value = false;
};

const saveData = async () => {
    submitted.value = true;

    let { _id, name, permission } = cruddata.value || {};

    if (!name && !name.trim()) {
        return null;
    }

    if (_id) {
        const response = await axios.put(
            `/roles/${_id}`,
            {
                name,
                permission
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
        cruddata.value = response.data;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Roles Updated', life: 3000 });
    } else {
        const response = await axios.post(
            `/roles`,
            {
                _id,
                name,
                permission
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        );
        cruddata.value = response.data;
        cruddatas.value.push(cruddata.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Roles Created', life: 3000 });
    }
    crudDialog.value = false;
    cruddata.value = {};
};

const newRole = async () => {
    submitted.value = true;
    let { _id, name, permission } = cruddata.value || {};

    if (!name && !name.trim()) {
        return null;
    }

    const response = await axios.post(
        `/roles`,
        {
            _id,
            name,
            permission
        },
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
    );
    cruddata.value = response.data;
    isRolename.value = true;
    cruddatas.value.push(cruddata.value);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Roles Created', life: 3000 });
};

const editData = (editData) => {
    cruddata.value = { ...editData };
    autoValue.value = repopulateAutoValue.value;
    const { permissions } = editData;
    const permissionsList = reactive(
        permissions.map((permission) => {
            return {
                name: permission
            };
        })
    );
    const uniqueNames = autoValue.value.filter((name) => {
        // check if the name exists in permissionsList
        const exists = permissionsList.some((permission) => {
            return permission.name === name.name;
        });
        // if the name doesn't exist in permissionsList, keep it
        return !exists;
    });
    autoValue.value = Array.from(uniqueNames);

    isRolename.value = true;
    crudDialog.value = true;
};

const confirmDeleteData = (editData) => {
    cruddata.value = editData;
    deletecrudDialog.value = true;
};

const deleteData = async () => {
    let { _id, name } = cruddata.value || {};
    const response = await axios.delete(`/roles/${_id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (response.status === 200) {
        cruddatas.value = cruddatas.value.filter((val) => val._id !== _id);
        deletecrudDialog.value = false;
        cruddata.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Order Deleted', life: 3000 });
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
            const response = await axios.delete(`/roles/${dataCrud._id}`, {
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
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Orders Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete job orders', life: 3000 });
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
    <div id="roles">
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
                        :rows="10"
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
                                <h5 class="m-0">Manage Roles</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="name" header="Role" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Role</span>
                                {{ slotProps.data.name }}
                            </template>
                            <template #filter="{ filterModel }">
                                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                            </template>
                        </Column>

                        <Column field="permissions" header="Permissions" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Permissions</span>
                                {{ slotProps.data.permissions }}
                            </template>
                        </Column>

                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Button v-if="canEdit" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editData(slotProps.data)" />
                                <Button v-if="canDelete" icon="pi pi-trash" class="p-button-rounded p-button-warning ml-2" @click="confirmDeleteData(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="crudDialog" :style="{ width: '600px' }" header="Roles and Permissions" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="name">Role Name</label>
                            <InputText id="name" v-model.trim="cruddata.name" required="true" autofocus :class="{ 'p-invalid': submitted && !cruddata.name }" />
                            <small class="p-invalid mb-2" v-if="submitted && !cruddata.name">Role Name is required.</small>
                            <Button v-if="!isRolename" label="Add Role Name" icon="pi pi-plus" class="p-button-success mr-2 mt-2" @click="newRole" />
                        </div>

                        <div class="formgrid grid" v-if="isRolename">
                            <div class="field col">
                                <h5>List of Available Permissions</h5>
                                <Listbox class="mb-2" ref="myListbox" v-model="selectedPermission" :options="autoValue" optionLabel="name" :filter="true" id="myListbox" />
                                <Button label="Add Permissions" icon="pi pi-plus" :disabled="!selectedPermission && selectedPermission2" class="p-button-success mr-2" @click="doSomething()" />
                            </div>

                            <div class="field col">
                                <h5>Your Current Permissions</h5>
                                <Listbox class="mb-2" ref="myListbox2" v-model="selectedPermission2" :options="cruddata.permissions" id="myListbox2" />
                                <Button label="Remove Permissions" :disabled="!selectedPermission2 && selectedPermission" icon="pi pi-minus" class="p-button-danger mr-2" @click="doSomething2()" />
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
                            <span v-if="cruddata">Are you sure you want to delete the selected roles?</span>
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
