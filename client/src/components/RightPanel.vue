<template>
    <div class="right-panel">
        <div class="right-panel-item">
            <a href="">
                <FontAwesomeIcon :icon="['fas', 'home']" />
                <span class="label">Начало</span>
            </a>
        </div>
        <div class="right-panel-item">
            <a href="">
                <FontAwesomeIcon :icon="['fas', 'search-location']" />
                <span class="label">Намери</span>
            </a>
        </div>
        <div class="right-panel-item">
            <a href="">
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
}
</script>

<style>
.right-panel {
        background: rgba(0,0,0,0.5);               
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .right-panel-item a {
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column; 
        text-decoration: none;
        color: white;
        align-items: center;
        padding: 12px;
        transition: .3s;
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
</style>