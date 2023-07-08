<script setup>
import { onMounted, ref, computed } from 'vue';
import JobOrderService from '@/service/JobOrderService';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';

const joborders = ref(null);
const joborderService = new JobOrderService();
const count = ref('');
const countName = ref('');
const store = useStore();
onMounted(async () => {
    const data = await joborderService.getJobOrders();
    joborders.value = data;
    count.value = joborders.value ? joborders.value.reduce((acc, joborder) => (joborder.id ? acc + 1 : acc), 0) : 0;
    countName.value = computed(() => (joborders.value ? [...new Set(joborders.value.map((joborder) => joborder.client_name))].length : 0));
});

const print = (printData) => {
    joborderService.myPrintData(printData);
};

const hasPermission = (permission, currentUserRole, roles) => {
    const role = roles.find((r) => r.name === currentUserRole);
    if (!role) return false;
    const permissions = role.permissions;
    if (!permissions) return false;
    return permissions.includes(permission);
};

// usage of permissions:
const canRead = computed(() => hasPermission('dashboard:read', store.state.currentUserRole, store.state.roles));
</script>


<template>
    <div>
        <div v-if="!canRead">
            <AccessDenied></AccessDenied>
        </div>
        <div class="grid" v-if="canRead">
            <div class="col-12 lg:col-6 xl:col-6">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Firearms</span>
                            <div class="text-900 font-medium text-xl">{{ count }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6 xl:col-6">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Personnels</span>
                            <div class="text-900 font-medium text-xl">{{ countName }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-12">
                <div class="card">
                    <h5>Recent Job Orders</h5>
                    <DataTable :value="joborders" :rows="20" :paginator="true" responsiveLayout="scroll">
                        <Column field="job_id" header="Job Order #" :sortable="true" style="width: 35%"></Column>
                        <Column field="client_name" header="Name" :sortable="true" style="width: 35%"></Column>
                        <Column field="unit_description" header="Description" :sortable="true" style="width: 35%"></Column>
                        <Column field="unit_problem" header="Unit Problem" :sortable="true" style="width: 35%"></Column>
                        <Column style="width: 15%">
                            <template #header> View </template>
                            <template #body="slotProps">
                                <Button @click="print(slotProps.data)" icon="pi pi-search" type="button" class="p-button-text"></Button>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
