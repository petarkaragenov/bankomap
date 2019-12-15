<template>
    <div>
        <div id="mapContainer" ref="mapContainer"></div>
        <div class="left-panel">
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
                
        </div>
        <LeftPanel :offices="offices" :showPopup="showPopup" />
        <RightPanel />
    </div>
    
</template>

<script>
import RightPanel from '../components/RightPanel'
import LeftPanel from '../components/LeftPanel'
export default {
    components: {
        RightPanel, LeftPanel
    },
    data() {
        return {
            map: {},
            platform: {},
            apikey: process.env.VUE_APP_HEREAPIKEY,
            ui: {},
            initialZoom: 12,
            searchCoords: this.$store.getters.getLocation[0].coords,
            offices: this.$store.getters.getData.offices
        }
    },
    methods: {
        addMarkerToGroup(group, coords, data) {
            coords = { lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) }

            const marker = new H.map.Marker(coords);
            marker.setData(this.setInfoBubbleContent(data));
            group.addObject(marker);
        },
        addInfoBubble() {
            const group = new H.map.Group();
        
            this.map.addObject(group);
        
            group.addEventListener('tap', (e) => {
                const geo = e.target.getGeometry()
                const data = e.target.getData()

                this.popUp(geo, data)
            }, false);

            this.offices.map(office => {
                this.addMarkerToGroup(group, office.coords, office)
            })
        },
        centerMap(geo) {
            this.map.setCenter(geo);
            this.map.setZoom(14);
        },
        popUp(coords, data) {
            const geo = { lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) }
            this.centerMap(geo)

            const bubble =  new H.ui.InfoBubble(coords, { content: data });

            this.ui.getBubbles().forEach(bub => this.ui.removeBubble(bub))
            this.ui.addBubble(bubble);
        },
        showPopup(e) {
            const data = JSON.parse(e.target.getAttribute('data-data'))
            this.popUp(data.coords, this.setInfoBubbleContent(data))
        },
        setInfoBubbleContent(data) {
            let html = `<p class="title"><strong>${data.title}</strong></p>`
            if (data.info) html += `<p><i>${data.info}</i></p>`
            if (data.email) html += `<p>E-mail: ${data.email}</p>`
            if (data.phone) html += `<p>Тел.: ${data.phone}</p>`
            if (data.fax) html += `<p>Факс: ${data.fax}</p>`
            if (data.open) html += `<p>${data.open}</p>`

            return html
        },
        stringify(office) {
            return JSON.stringify(office)
        }
    },
    created() {  
        this.platform = new H.service.Platform({
            apikey: this.apikey
        });
    },
    mounted() {
        const defaultLayers = this.platform.createDefaultLayers();

        this.map = new H.Map(
            this.$refs.mapContainer,
            defaultLayers.vector.normal.map,
            {
                zoom: this.initialZoom,
                center: this.searchCoords,
                pixelRatio: window.devicePixelRatio || 1
            }
        )
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

        this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
        this.addInfoBubble()

        window.addEventListener('resize', () => {
            this.map.getViewPort().resize(); 
        });
    }
}
</script>

<style scoped>
    #mapContainer {
        width: 100vw;
        height: 100vh;
    }
</style>