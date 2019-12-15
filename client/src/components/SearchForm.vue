<template>
  <form class="search-form" @submit.prevent="handleSubmit">
        <div class="search-fields">
            <div class="search-field">
                <input 
                type="text" 
                class="search-input" 
                placeholder="Населено място..." 
                v-model="location" 
                autofocus 
                @keyup="showSuggestions(location)"
                ref="locationInput"
                >
                <ul class="suggestions" ref="suggestions">
                    <li v-for="(location, i) in matchingLocations" :key="i" @click="selectLocation(location)">{{ location }}</li>
                </ul>
            </div>
            <div class="search-field">
                <select class="search-input" v-model="name">
                    <option v-for="(bank, i) in orderedBanks" :key="i" :value="bank">{{ bank | capitalize }}</option>
                </select>
            </div>
            <button class="submit" type="submit">Търси</button>
        </div>
        <div class="search-options">
            <div class="checkbox-field">
                <input type="checkbox" value="till_late" id="till_late" v-model="till_late"> 
                <label for="till_late">Работи след 18:00ч.</label>
            </div>
            <div class="checkbox-field">
                <input type="checkbox" value="saturday" id="saturday" v-model="saturday"> 
                <label for="saturday">Работи в събота</label>
            </div>
            <div class="checkbox-field">
                <input type="checkbox" value="sunday" id="sunday" v-model="sunday"> 
                <label for="sunday">Работи в неделя</label>
            </div>
        </div>
    </form>
</template>

<script>
import { mapActions } from 'vuex'
import locations from '../assets/data/locations'
import banks from '../assets/data/banks'

export default {
    data() {
        return {
            locations: locations.map(location => location.name),
            banks,
            matchingLocations: [],
            sunday: null,
            saturday: null,
            till_late: null,
            name: 'алианц банк българия',
            location: null
        }
    },
    methods: {
        showSuggestions(location) {
            this.$refs.locationInput.classList.remove('feedback')
            if (
                this.locations.includes(location.toLowerCase()) ||
                location.length < 2
            ) {
                this.$refs.suggestions.style.visibility = 'hidden'
                this.$refs.suggestions.style.pointerEvents = 'none'
            } else {
                this.$refs.suggestions.style.visibility = 'visible'
                this.$refs.suggestions.style.pointerEvents = 'auto'

            this.matchingLocations = this.locations
                .filter(loc => loc.startsWith(location.toLowerCase()))
                .map(loc => loc[0].toUpperCase() + loc.substr(1))
                .sort()
        }
    },
        selectLocation(location) {
            this.location = location
            this.$refs.suggestions.style.visibility = 'hidden'
            this.$refs.suggestions.style.pointerEvents = 'none'
        }, 
        handleSubmit() {
            if (!this.location) {
                this.$refs.locationInput.classList.add('feedback')
                this.$refs.locationInput.focus()
                return
            }
            else {
                const location = this.location.split(' ').join('+').toLowerCase()
                const name = this.name.split(' ').join('+').toLowerCase()

                const url = 'http://localhost:3000/api/offices'
                let params = { name, location }

                if (this.till_late) params.till_late = !!this.till_late
                if (this.saturday) params.saturday = !!this.saturday
                if (this.sunday) params.sunday = !!this.sunday
                
                axios(url, { params })
                    .then(res => {
                        this.$store.dispatch('populateData', res.data)
                        this.$store.dispatch('setLocation', locations
                            .filter(loc => loc.name === location.replace('+', ' '))
                        )
                        this.$router.push({ name: 'office-map' })
                    })
                    .catch(err => console.log(err))
            }
        }
    },
    computed: {
        orderedLocations() {
            return this.locations.slice().sort()
        },
        orderedBanks() {
            return this.banks.slice().sort()
        }
    },
    filters: {
        capitalize(text) {
            const toUpper = ['дск', 'бнп', 'ад', 'еад']
            const notToCapitalize = 'за'

            let arr = text.split(' ')
            arr = arr.map(item => {
            if (toUpper.includes(item)) return item.toUpperCase()
            if (item === notToCapitalize) return item
            return item[0].toUpperCase() + item.substr(1)
            })
            return arr.join(' ')
        }
    }
}
</script>

<style>

</style>