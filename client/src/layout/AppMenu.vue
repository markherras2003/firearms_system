<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Administrator Panel',
        items: [
            { label: 'Users Account', icon: 'pi pi-fw pi-users', to: '/pages/users' },
            { label: 'Job Orders', icon: 'pi pi-fw pi-id-card', to: '/pages/joborders' },
        ]
    },
    {
        label: 'Access Control',
        items: [
            { label: 'Roles', icon: 'pi pi-fw pi-users', to: '/pages/roles' },
            { label: 'Permissions', icon: 'pi pi-fw pi-id-card', to: '/pages/permissions' },
        ]
    },
]);

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
