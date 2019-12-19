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
    .bank {
        padding: 20px;
        border-bottom: 1px solid rgba(8, 48, 69, 0.6);
    }

    .bank .bank-name {
        padding: 10px 0;
    }

    .bank-row {
        display: flex;
    }

    .bank-row a {
        text-decoration: none;
        display: inline-block;
        padding-bottom: 2px;
        border-bottom: 1px solid transparent;
        transition: .3s;
    }

    .bank-row a:hover {
        border-bottom: 1px solid rgba(8, 48, 69, 0.8);
    }

    .bank-row .col-left {
        flex: 1;
    }

    .bank-row .col-right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .bank-row ul li svg {
        margin-right: 8px;
    }

    .col-left ul {
        list-style-type: none;
        margin-left: 16px;
    }

    .col-left ul li {
        padding: 6px 0;
    }
    .bank:last-child {
        border-bottom: none;
    }

    @media (max-width: 920px) {
        .bank .bank-name {
            font-size: 1rem;
        }

        .bank .bank-row {
            font-size: .925rem;
        }

        .col-left ul li {
            padding: 3px 0;
        }
    }

    @media (max-width: 743px) {
        .bank-row {
            flex-direction: column;
        }

        .col-right {
            display: block !important;
            margin-left: 16px;
            margin-top: 15px;
        }
    }

    @media (max-width: 622px) {
        .bank {
            padding: 10px;
        }
    }

    @media (max-width: 400px) {
        .bank .bank-name {
            font-size: .925rem;
        }

        .bank .bank-row {
            font-size: .875rem;
        }

        .col-right, .col-left ul {
            margin-left: 6px;
        }
    }
</style>