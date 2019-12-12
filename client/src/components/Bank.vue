<template>
    <div>
        <div class="bank" v-for="bank in source" :key="bank._id">
            <h3 class="bank-name">{{ bank.name }}</h3>
            <div class="bank-row">
                <div class="col-left">
                    <ul>
                        <li v-if="bank.phone">
                            <FontAwesomeIcon :icon="['fas', 'phone-square-alt']" />
                            {{ bank.phone }}
                        </li>
                        <li v-if="bank.fax">
                            <FontAwesomeIcon :icon="['fas', 'fax']" />
                            {{ bank.fax }}
                        </li>
                        <li v-if="bank.email">
                            <FontAwesomeIcon :icon="['fas', 'envelope']" />
                            <a :href="'mailto:' + bank.email">{{ bank.email }}</a>
                        </li>
                        <li>
                            BIC/SWIFT: 
                            {{ bank.swift }}
                        </li>
                    </ul>
                </div>
                <div class="col-right">
                    <a :href="bank.web" target="_blank">{{ bank.web }} <FontAwesomeIcon :icon="['fas', 'external-link-alt']" /></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
    props: ['source'],
    components: {
        FontAwesomeIcon
    }
}
</script>

<style scoped>
    .bank:last-child {
        border-bottom: none;
    }
</style>