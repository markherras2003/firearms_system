<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardService from '@/service/DashboardService';
import { useStore } from 'vuex';
import AccessDenied from '@/components/AccessDenied.vue';

const firearms = ref(null);
const personnels = ref(null);
const firearms_monitoring = ref(null);
const firearms_monitoringlog = ref(null);
const dashboardService = new DashboardService();
const personnelsTotal = ref('');
const fireArmsTotal = ref('');
const fireArmsAvailable = ref('');
const fireArmsNotAvailable = ref('');
const store = useStore();
onMounted(async () => {
    const data = await dashboardService.getFirearms();
    const personnel_data = await dashboardService.getPersonnels();
    const firearms_monitor_data = await dashboardService.getFireArmsMonitoring();
    const firearms_monitorlog_data = await dashboardService.getFireArmsMonitoringLog();
    firearms.value = data;
    personnels.value = personnel_data;
    firearms_monitoring.value = firearms_monitor_data;
    firearms_monitoringlog.value = firearms_monitorlog_data;
    personnelsTotal.value = computed(() => (personnels.value ? [...new Set(personnels.value.map((personnel) => personnel.personnel_id))].length : 0));
    fireArmsTotal.value = computed(() => (firearms.value ? [...new Set(firearms.value.map((firearm) => firearm.firearms_serialno))].length : 0));
    fireArmsAvailable.value = computed(() => {
        if (firearms.value) {
            const availabilityValues = firearms.value.map((firearm) => firearm.firearms_availability);
            const trueCount = availabilityValues.filter((availability) => availability === true).length;
            return trueCount;
        } else {
            return 0;
        }
    });
    fireArmsNotAvailable.value = computed(() => {
        if (firearms.value) {
            const availabilityValues = firearms.value.map((firearm) => firearm.firearms_availability);
            const falseCount = availabilityValues.filter((availability) => availability === false).length;
            return falseCount;
        } else {
            return 0;
        }
    });
});

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

            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Personnels</span>
                            <div class="text-900 font-medium text-xl">{{ personnelsTotal }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-users text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Firearms</span>
                            <div class="text-900 font-medium text-xl">{{ fireArmsTotal }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-qrcode text-red-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3"><strong>Firearms Available/ IN</strong></span>
                            <div class="text-900 font-medium text-xl">{{ fireArmsAvailable }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-qrcode text-green-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3"><strong>Firearms Not Available/ OUT</strong></span>
                            <div class="text-900 font-medium text-xl">{{ fireArmsNotAvailable }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-qrcode text-pink-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-12">
                <div class="card">
                    <h5>Current Firearms Monitoring</h5>
                    <DataTable :value="firearms_monitoring" :rows="10" :paginator="true" responsiveLayout="scroll">
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
                        <Column field="firearms" header="Fire Arms" :sortable="true" headerStyle="width:22%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                <template v-if="slotProps.data.fire_arms !== null && slotProps.data.fire_arms.firearms !== undefined && slotProps.data.fire_arms.firearms !== null">
                                    {{ slotProps.data.fire_arms.firearms }}
                                </template>
                            </template>
                        </Column>
                        <Column field="firearms_status" header="Firearms Status" :sortable="true" headerStyle="width:22%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Firearms Status</span>
                                {{ slotProps.data.firearms_status }}
                            </template>
                        </Column>
                        <Column field="firearms_purpose" header="Firearms Purpose" :sortable="true" headerStyle="width:22%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Firearms Purpose</span>
                                {{ slotProps.data.firearms_purpose }}
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
                    </DataTable>
                </div>
            </div>


            <div class="col-12 xl:col-12">
                <div class="card">
                    <h5>Firearms Monitoring History/Log</h5>
                    <DataTable :value="firearms_monitoringlog" :rows="10" :paginator="true" responsiveLayout="scroll">
                        <Column field="firearms_monitor_log_id" header="Fire Arms Monitor ID." :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms Monitor ID.</span>
                                {{ slotProps.data.firearms_monitor_log_id }}
                            </template>
                        </Column>
                        <Column field="firearms_serialno" header="Fire Arms Serial No." :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                {{ slotProps.data.firearms_serialno }}
                            </template>
                        </Column>
                        <Column field="firearms" header="Fire Arms" :sortable="true" headerStyle="width:22%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Fire Arms.</span>
                                <template v-if="slotProps.data.fire_arms !== null && slotProps.data.fire_arms.firearms !== undefined && slotProps.data.fire_arms.firearms !== null">
                                    {{ slotProps.data.fire_arms.firearms }}
                                </template>
                            </template>
                        </Column>
                        <Column field="firearms_status" header="Firearms Status" :sortable="true" headerStyle="width:22%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Firearms Status</span>
                                {{ slotProps.data.firearms_status }}
                            </template>
                        </Column>
                        <Column field="firearms_purpose" header="Firearms Purpose" :sortable="true" headerStyle="width:22%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Firearms Purpose</span>
                                {{ slotProps.data.firearms_purpose }}
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
                    </DataTable>
                </div>
            </div>


        </div>
    </div>
</template>
