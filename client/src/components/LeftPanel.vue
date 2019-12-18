<template>
    <div class="left-panel">
        <perfect-scrollbar>
            <div 
                @click="showPopup" 
                v-for="office in offices" 
                :key="office._id" 
                class="office-box" 
                :data-data="stringify(office)"
            >
                <div class="content">
                    <h3 class="title">{{ office.title }}</h3>
                    <p class="address">{{ office.address }}</p>
                    <p class="open">{{ office.open }}</p>
                </div>
            </div> 
        </perfect-scrollbar>             
    </div>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
export default {
    components: {
        PerfectScrollbar
    },
    props: ['offices', 'showPopup'],
    methods: {
        stringify(office) {
            return JSON.stringify(office)
        }
    }
}
</script>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>
<style>
    .left-panel {
        position: absolute;
        height: 95%;
        width: 20%;
        margin: auto 0;
        background: #F4F4F4;
        top: 2.5%;
        left: 2%;
        bottom: 2.5%;
        /* overflow-y: scroll; */
        box-shadow: 0em 0 0.4em rgba(15, 22, 33, 0.6);
        border-radius: 6px;
    }

    .left-panel .office-box {
        /* height: 150px; */
        padding: 15px 15px 0 20px;
        cursor: pointer;
        transition: .3s;
    }

    .office-box .content {
        min-height: 150px;
        position: relative;
        border-bottom: 1px solid #9D6F84;
        pointer-events: none;
    }

    .office-box:hover {
        background: #d4d4d4;
    }

    .office-box h3.title {
        color: rgb(4, 0, 61);
        font-size: 1.35rem;
        margin-bottom: 10px;
        text-transform: uppercase;
        font-size: 1rem;
    }

    .office-box .address, .office-box .open {
        color: #9D6F84;
        font-size: 0.8rem;
    }

    .open {
        position: absolute;
        bottom: 18px;
        left: 0;
    }

    .ps {
        height: 99%;
    }
</style>