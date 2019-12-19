<template>
    <div class="right-panel">
        <div class="right-panel-item">
            <router-link to="/">
                <FontAwesomeIcon :icon="['fas', 'home']" />
                <span class="label">Начало</span>
            </router-link>
        </div>
        <div class="right-panel-item">
            <a @click.prevent="showSearchForm" :class="{ selected: searchMode }">
                <FontAwesomeIcon :icon="['fas', 'search-location']" />
                <span class="label">Намери</span>
            </a>
        </div>
        <div class="right-panel-item">
            <a @click.prevent="showRoute">
                <FontAwesomeIcon :icon="['fas', 'route']" />
                <span class="label">Маршрут</span>
            </a>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
    components: {
        FontAwesomeIcon
    },
    props: ['platform', 'onResult'],
    data() {
        return {
            searchMode: false
        }
    },
    methods: {
        showRoute() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.displayLocationInfo, () => {
                    this.$swal({ icon: 'warning', text: 'Моля разрешете достъп до данните за локация!' })
                }, { enableHighAccuracy: true });              
            }
        },
        displayLocationInfo(position) {
            const lng = position.coords.longitude;
            const lat = position.coords.latitude;

            this.$store.dispatch('setStartWaypoint', `geo!${lat},${lng}`)

            if (!this.$store.getters.getRoutingParameters['waypoint1']) {
                return this.$swal({ icon: 'warning', text: 'Моля изберете офис!' })
            }

            const routingParameters = this.$store.getters.getRoutingParameters
            const router = this.platform.getRoutingService();

            router.calculateRoute(routingParameters, this.onResult,
                function(error) {
                    alert(error.message);
                });
        },
        showSearchForm(e) {
            const checkboxes = document.querySelectorAll('.checkbox-field')
            if (this.searchMode) {
                document.querySelector('.search-form').style.transform = 'translateY(-140%)'
                checkboxes.forEach(checkbox => {
                    checkbox.style.transform = 'scale(0)'
                })
                this.searchMode = !this.searchMode
            } else {
                document.querySelector('.search-form').style.transform = 'translateY(0)'
                checkboxes.forEach((checkbox, i) => {
                    setTimeout(() => {
                        checkbox.style.transform = 'scale(1)'
                    }, i*400)
                })
                this.searchMode = !this.searchMode
            }
        }
    }
}
</script>

<style>
    .selected {
        background: black;
    }

    .right-panel {
        background: rgba(0,0,0,0.5);               
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .right-panel-item a {
        margin: 0;
        display: flex;
        flex-direction: column; 
        text-decoration: none;
        color: white;
        align-items: center;
        padding: 12px;
        transition: .3s;
        cursor: pointer;
    }

    .right-panel-item a:hover {
        background: rgba(0,0,0,0.8); 
    }

    .right-panel-item a .label {
        font-size: 0.6rem;
        text-transform: uppercase;
        margin-top: 8px;
    }

    .right-panel-item a .fas {
        color: white !important;
    }

    @media (max-width: 468px) {
        .right-panel-item a {
            padding: 6px 4px;
        }

        .right-panel-item a .label {
            font-size: .5rem;
        }
    }
</style>