<template>
    <div>
        <div id="mapContainer" ref="mapContainer"></div>
        <SearchForm />
        <LeftPanel
            :offices="offices" 
            :showPopup="showPopup" 
            @showOverlay="showOverlay" 
            @hideOverlay="hideOverlay" 
        />
        <RightPanel :platform="platform" :onResult="onResult" />
        <DistancePopup v-if="distance" :distance="distance" @hidePopup="distance = null" />
        <div class="map-overlay" ref="overlay"></div>
    </div>   
</template>

<script>
import RightPanel from '../components/RightPanel'
import LeftPanel from '../components/LeftPanel'
import SearchForm from '../components/SearchForm'
import DistancePopup from '../components/DistancePopup'
export default {
    components: {
        RightPanel, LeftPanel, SearchForm, DistancePopup
    },
    data() {
        return {
            map: {},
            platform: {},
            apikey: process.env.VUE_APP_HEREAPIKEY,
            ui: {},
            initialZoom: 12,
            routeLine: null,
            clusteringLayer: null,
            distance: null
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
                <circle cx="25px" cy="25px" r="13" fill="#083045" stroke="#083045" stroke-width="12" stroke-opacity="0.2" />
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

                if (route.summary.distance < 1000) {
                    this.distance = route.summary.distance + ' м'
                } else {
                    this.distance = (route.summary.distance / 1000).toFixed(2) + ' км'
                }
            
                routeShape.forEach(function(point) {
                    const parts = point.split(',');
                    linestring.pushLatLngAlt(parts[0], parts[1]);
                });
            
                startPoint = route.waypoint[0].mappedPosition;
                endPoint = route.waypoint[1].mappedPosition;

                const routeOutline = new H.map.Polyline(linestring, {
                    style: {
                        lineWidth: 6,
                        strokeColor: 'rgba(8, 48, 69, 0.5)',
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
                    fillColor: 'rgba(8, 48, 69, 0.5)',
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
        },
        showOverlay() {
            this.$refs.overlay.style.opacity = '.7'
        },
        hideOverlay() {
            this.$refs.overlay.style.opacity = 0
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

        window.addEventListener('resize', (e) => {
            const leftPanel = document.querySelector('.left-panel')
            const leftPanelControls = document.querySelector('.left-panel-controls')

            if (e.target.innerWidth > 920) {
                if (leftPanel.style.transform) {
                    leftPanel.style.removeProperty('transform')
                } 
                else if (this.$refs.overlay.style.opacity = '.7') {
                    this.$refs.overlay.style.opacity = 0
                    leftPanelControls.style.color = '#3F454D'
                    this.$store.dispatch('changeLeftPanelControl', 'bars')
                }                        
            }
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
    /* prefixed by https://autoprefixer.github.io (PostCSS: v7.0.23, autoprefixer: v9.7.3) */

#mapContainer {
        width: 100vw;
        height: 100vh;
    }

    .search-form {
        position: absolute;
        z-index: 300;
        left: 30%;
        top: 0;
        width: 60%;
        -webkit-transform: translateY(-140%);
            -ms-transform: translateY(-140%);
                transform: translateY(-140%);
        -webkit-transition: .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        -o-transition: .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transition: .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .search-form /deep/ .search-fields {
        border: 10px solid rgba(58, 99, 120, 0.3);
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
    } 

    .search-form /deep/ .search-field {
        min-width: 160px;
    }

    .search-form /deep/ .search-input {
        padding: 11px;
        font-size: 1.075rem;
        height: calc(1.075rem + 23px);
    }

    .search-form /deep/ .search-fields .submit {
        font-size: 1.075rem;
        min-width: 60px;
        padding: 9px;
    }

    .search-form /deep/ .checkbox-field {
        background: rgba(58, 99, 120, 1);
        font-size: 0.925rem;
        padding: 6px;
        border-radius: 4px;
        -webkit-transform: scale(0);
            -ms-transform: scale(0);
                transform: scale(0);
        -webkit-transform-origin: 50% 50%;
            -ms-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        -webkit-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1) .4s;
        -o-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1) .4s;
        transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1) .4s;
    } 

    .search-form /deep/ .search-options {
        margin-left: 15px;
    }

    .map-overlay {
        background: rgb(0,0,0);
        opacity: 0;
        width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: 350;
        top: 0;
        left: 0;
        pointer-events: none;
        -webkit-transition: .4s;
        -o-transition: .4s;
        transition: .4s;
    }

    @media (max-width: 920px) {
        .search-form {
            width: 80%;
            left: 10%;
        }
    }

    @media (max-width: 734px) {
        .search-form {
            width: 88%;
            left: 6%;
            top: 12px;
        }
    }

    @media (max-width: 622px) {
        .search-form /deep/ .search-fields {
            border-width: 6px;
        } 

        .search-form /deep/ .search-input {
            padding: 8px;
            font-size: 1rem;
            height: calc(1rem + 17px);
        }

        .search-form /deep/ .search-fields .submit {
            font-size: 1rem;
            padding: 8px;
        }

        .search-form /deep/ .search-options {
            margin-top: 10px;
        }
    }

    @media (max-width: 550px) {
        .search-form {
            top: 20px;
        }

        .search-form /deep/ .search-fields {
            border-width: 4px;
            border-radius: 2px;
        } 

        .search-form /deep/ .search-options {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
        }

        .search-form /deep/ .checkbox-field {
            padding: 8px;
            margin-bottom: 4px;
        }
    }

    @media (max-width: 400px) {
        .search-form /deep/ .search-fields {
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            border-width: 2px;
        }

        .search-form /deep/ .search-input:first-of-type {
            border: none;
            border-bottom: 1px solid rgba(0,0,0,0.4);
        }
    }
</style>