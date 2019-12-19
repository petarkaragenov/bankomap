<template>
    <div class="left-panel" ref="leftPanel">
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
        <div class="left-panel-controls" ref="leftPanelControls">
            <FontAwesomeIcon 
                :icon="icon" 
                size="lg" 
                @click="showLeftPanel" 
            />
        </div>          
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
export default {
    components: {
        FontAwesomeIcon, PerfectScrollbar
    },
    props: ['offices', 'showPopup'],
    data() {
        return {
            hidden: true
        }
    },
    computed: {
        icon() {
            return this.$store.getters.getLeftPanelControl
        }
    },
    methods: {
        stringify(office) {
            return JSON.stringify(office)
        },
        showLeftPanel() {
            const leftPanel = this.$refs.leftPanel

            if (this.hidden) {
                leftPanel.style.transform = 'translateX(0)'
                this.$store.dispatch('changeLeftPanelControl', 'times')
                this.$refs.leftPanelControls.style.color = 'white'
                this.$emit('showOverlay')            
            } else {
                leftPanel.style.transform = 'translateX(calc(-100% - 5px))'
                this.$store.dispatch('changeLeftPanelControl', 'bars')
                this.$refs.leftPanelControls.style.color = '#3F454D'
                this.$emit('hideOverlay')  
            }

            this.hidden = !this.hidden
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
        transition: .4s;
    }

    .left-panel .left-panel-controls {
        display: none;
    }

    .left-panel .office-box {
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
        height: 100%;
    }

    @media (max-width: 1075px) {
        .left-panel {
            width: 25%;
            height: 100%;
            top: 0;
            left: 0;
            bottom: 0;
            border-radius: 0;
        }
    }

    @media (max-width: 920px) {
        .left-panel {
            z-index: 400;
            width: 30%;
            transform: translateX(calc(-100% - 5px));
        }

        .left-panel .left-panel-controls {
            display: block;
            position: absolute;
            z-index: 400;
            top: 10px;
            left: calc(100% + 15px);
            color: #3F454D;
            cursor: pointer;
            transition: .4s;
        }
    }

    @media (max-width: 808px) {
        .left-panel {
            width: 40%;
        }
    }

    @media (max-width: 620px) {
        .left-panel {
            width: 50%;
        }

        .office-box h3.title {
            font-size: 0.925rem;
        }
    }

    @media (max-width: 468px) {
        .left-panel {
            width: 65%;
        }

        .office-box h3.title {
            font-size: .85rem;
        }

        .office-box .content {
            min-height: 135px !important;
        }
    }

    @media (max-width: 400px) {
        .left-panel {
            width: 75%;
        }
    }
</style>