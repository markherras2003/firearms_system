<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);
const router = useRouter();
const store = useStore();
const message = ref([]);
const count = ref(0);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo' : 'logo'}.jpg`;
});

async function fetchData() {
    try {
        const { data: roles } = await axios.get('/roles/state', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        const { data: permissions } = await axios.get('/permissions/state', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        store.commit('setRoles', roles);
        store.commit('setPermissions', permissions);
    } catch (error) {
        console.log(error);
    }
}

async function fetchCurrentUserRole(role) {
    try {
        store.commit('setCurrentUserRole', role);
    } catch (error) {
        console.log(error);
    }
}

const handleSubmit = async (type) => {
    try {
        const response = await axios.post('/auth/login', {
            email: email.value,
            password: password.value
        });

        if (response.status === 200 && response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('_id', response.data.user._id);
            store.dispatch('user', response.data);
            fetchData();
            fetchCurrentUserRole(response.data.user.role);
            router.push('/');
        } else if (response.status === 400 && response.data.msg) {
            alert('test');
            type = 'error';
            throw new Error(response.data.msg);
        } else if (response.data && response.data.error) {
            throw new Error(response.data.error);
        } else {
            throw new Error('Invalid response');
        }
    } catch (error) {
        type = 'error';
        if (type === 'error') {
            message.value = [{ severity: 'error', detail: 'Error Message', content: 'Incorrect Username / Password ', id: count.value++ }];
        }
    }
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <form>
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                        <div>
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" @keyup.enter="handleSubmit"></Password>

                            <transition-group name="p-message" tag="div">
                                <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                            </transition-group>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)"></a>
                            </div>
                            <Button label="Sign In" class="w-full p-3 text-xl" @click.prevent="handleSubmit" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
