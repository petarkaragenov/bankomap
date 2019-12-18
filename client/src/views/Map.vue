<template>
    <div>
        <div id="mapContainer" ref="mapContainer"></div>
        <SearchForm />
        <LeftPanel :offices="offices" :showPopup="showPopup" />
        <RightPanel :platform="platform" :onResult="onResult" />
    </div>
    
</template>

<script>
import RightPanel from '../components/RightPanel'
import LeftPanel from '../components/LeftPanel'
import SearchForm from '../components/SearchForm'
export default {
    components: {
        RightPanel, LeftPanel, SearchForm
    },
    data() {
        return {
            map: {},
            platform: {},
            apikey: process.env.VUE_APP_HEREAPIKEY,
            ui: {},
            initialZoom: 12,
            routeLine: null,
            clusteringLayer: null
        }
    },
    computed: {
        offices() {
            return this.$store.getters.getData.offices
        },
        searchCoords() {
            return this.$store.getters.getLocation[0].coords
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
                            self.centerMap(e.target.getGeometry(), 15)
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
                            self.$store.dispatch('setEndWaypoint', `geo!${geo.lat},${geo.lng}`)
                            self.popUp(geo, data)
                        })
                        return noiseMarker;
                    }
                }      
            });
        
            const clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);  
            this.clusteringLayer = clusteringLayer
            map.addLayer(clusteringLayer);
        },
        onResult(result) {
            if (Object.keys(this.map.getObjects()).length > 0) {
                for (let object of this.map.getObjects()){
                    if (object.id === 'route'){
                            this.map.removeObject(object);
                    }
                }
            }
            var route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
            if(result.response.route) {
                route = result.response.route[0];
                routeShape = route.shape;
                linestring = new H.geo.LineString();

                console.log(route.summary.distance)
            
                routeShape.forEach(function(point) {
                    const parts = point.split(',');
                    linestring.pushLatLngAlt(parts[0], parts[1]);
                });
            
                startPoint = route.waypoint[0].mappedPosition;
                endPoint = route.waypoint[1].mappedPosition;

                const routeOutline = new H.map.Polyline(linestring, {
                    style: {
                        lineWidth: 6,
                        strokeColor: 'rgba(4,0,61, 0.5)',
                        lineTailCap: 'arrow-tail',
                        lineHeadCap: 'arrow-head'
                    }
                });
                    
                const routeArrows = new H.map.Polyline(linestring, {
                    style: {
                        lineWidth: 6,
                        fillColor: 'white',
                        strokeColor: 'rgba(255,255,255,1)',
                        lineDash: [0, 2],
                        lineTailCap: 'arrow-tail',
                        lineHeadCap: 'arrow-head' 
                    }
                });
            
                const routeLine = new H.map.Group();
                routeLine.id = 'route'
                routeLine.addObjects([routeOutline, routeArrows]);

                const startMarkerIcon = new H.map.Icon(require('../assets/marker.svg'), {
                    size: {
                        w: 42,
                        h: 60
                    }
                })
        
                const startMarker = new H.map.Marker({
                    lat: startPoint.latitude,
                    lng: startPoint.longitude
                }, { icon: startMarkerIcon });
        
                const endMarker = new H.map.Circle({
                    lat: endPoint.latitude,
                    lng: endPoint.longitude
                }, 6);

                endMarker.setStyle({
                    strokeColor: 'white',
                    fillColor: 'rgba(4,0,61, 0.5)',
                    lineWidth: 2
                })

                startMarker.id = 'route'
                endMarker.id = 'route'
            
                this.map.addObjects([routeLine, startMarker, endMarker]);

                this.map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
            }
        },
        centerMap(geo, zoom) {
            this.map.setCenter(geo);
            this.map.setZoom(zoom);
        },
        popUp(coords, data) {
            const geo = { lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) }
            this.centerMap(geo, 15)

            const bubble =  new H.ui.InfoBubble(coords, { content: data });

            this.ui.getBubbles().forEach(bub => this.ui.removeBubble(bub))
            this.ui.addBubble(bubble);
        },
        showPopup(e) {
            const data = JSON.parse(e.target.getAttribute('data-data'))
            this.$store.dispatch('setEndWaypoint', `geo!${data.coords.lat},${data.coords.lng}`)
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
    },
    updated() {
        this.map.removeLayer(this.clusteringLayer)
        this.startClustering(this.map, this.offices)
        this.centerMap(this.searchCoords, this.initialZoom)
    }
}
</script>

<style scoped>
    #mapContainer {
        width: 100vw;
        height: 100vh;
    }

    .search-form {
        position: absolute;
        left: 30%;
        top: 0;
        width: 50%;
        transform: translateY(-140%);
        transition: .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .search-form /deep/ .search-fields {
        border: 10px solid rgba(156, 146, 172, 0.3);
    } 

    .search-form /deep/ .search-input {
        padding: 11px;
        font-size: 1.075rem;
    }

    .search-form /deep/ select.search-input {
        padding: 10px;
    }

    .search-form /deep/ .search-fields .submit {
        font-size: 1.075rem;
    }

    .search-form /deep/ .checkbox-field {
        background: rgba(156, 146, 172, 1);
        font-size: 0.925rem;
        padding: 6px;
        border-radius: 4px;
        transform: scale(0);
        transform-origin: 50% 50%;
        transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1) .4s;
    } 
</style>