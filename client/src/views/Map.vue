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
        startClustering(map, data) {
            const clusterSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px">
                <circle cx="25px" cy="25px" r="13" fill="#04003D" stroke="#04003D" stroke-width="12" stroke-opacity="0.2" />
                <text x="25" y="30" font-size="10pt" font-family="arial" font-weight="bold" text-anchor="middle" fill="white">{label}</text>
            </svg>`

            const dataPoints = data.map((data) => {
                return new H.clustering.DataPoint(
                    data.coords.lat, 
                    data.coords.lng, 
                    1, 
                    this.setInfoBubbleContent(data)
                );
            });

            const self = this

            const clusteredDataProvider = new H.clustering.Provider(dataPoints, {
                clusteringOptions: {
                    eps: 32,
                    minWeight: 2
                },
                theme: {
                    getClusterPresentation(cluster) {  
                        const svgString = clusterSvg.replace('{label}', + cluster.getWeight());
                        const clusterIcon = new H.map.Icon(svgString, {
                            size: { w: 50, h: 50 },
                            anchor: { x: 10, y: 10}
                        });
                        
                        const clusterMarker = new H.map.Marker(cluster.getPosition(), {
                            icon: clusterIcon,
                            min: cluster.getMinZoom(),
                            max: cluster.getMaxZoom()
                        });

                        clusterMarker.setData(cluster); 
                        clusterMarker.addEventListener('tap', e => {
                            self.centerMap(e.target.getGeometry())
                        })
                        return clusterMarker;
                    },
                    getNoisePresentation(noisePoint) {
                        const noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
                            min: noisePoint.getMinZoom()
                        });

                        noiseMarker.setData(noisePoint);
                        noiseMarker.addEventListener('tap', (e) => {
                            const geo = e.target.getGeometry()
                            const data = e.target.getData().getData()
                            self.popUp(geo, data)
                        })
                        return noiseMarker;
                    }
                }      
            });
        
            const clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);  
            map.addLayer(clusteringLayer);
        },
        centerMap(geo) {
            this.map.setCenter(geo);
            this.map.setZoom(16);
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
            if (data.info) {
                html += '<div class="info">'
                data.info.split(';').forEach(piece => {
                    html += `<p>${piece.trim()}</p>`
                })
                html += '</div>'
            }
            if (data.email) html += `<p><strong>E-mail:</strong> ${data.email}</p>`
            if (data.phone) html += `<p><strong>Тел.:</strong> ${data.phone}</p>`
            if (data.fax) html += `<p><strong>Факс:</strong> ${data.fax}</p>`
            if (data.open) {
                html += '<div class="opening-hours">'
                data.open.split(';').forEach(piece => {
                    html += `<p><strong>${piece}</strong></p>`
                })
                html += '</div>'
            }

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
        this.startClustering(this.map, this.offices)

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