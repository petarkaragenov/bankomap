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
                    <li v-for="(location, i) in matchingLocations" :key="i" @click="selectLocation(location)">{{ location | capitalize }}</li>
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
                this.$swal({
                    title: "Грешка",
                    text: "Моля изберете населено място!",
                    icon: "error",
                    button: "Добре",
                }).then(() => {
                    this.$refs.locationInput.classList.add('feedback')
                    this.$refs.locationInput.focus()
                })                
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
                        if (res.data.offices.length === 0) {
                            this.$swal({
                                text: "Няма намерени резултати!",
                                icon: "warning",
                                button: "Добре",
                            })
                            return
                        }                       
                        this.$store.dispatch('populateData', res.data)
                        this.$store.dispatch('setLocation', locations
                            .filter(loc => loc.name === location.replace('+', ' '))
                        )
                        if (this.$route.path === "/") {
                            this.$router.push({ name: 'office-map' })
                        }
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

<style scoped>
    .search-form {
        width: 100%;
        margin: 30px 0;
    }

    .search-fields {
        border: 14px solid rgba(58, 99, 120, 0.3);
        border-radius: 8px;
        box-shadow: 0 0 6px rgba(0,0,0,0.5) 0 0 14px rgba(0,0,0,0.3) 0 0 22px rgba(0,0,0,0.1);
        display: flex;
    }

    .search-field {
        flex: 2.5;
    }

    .search-field .suggestions {
        position: absolute;
        width: 100%;
        top: 56px;
        left: 0;
        color: black;
        visibility: hidden;
        pointer-events: none;
        list-style-type: none;
        padding: 0;
        margin: 0;
        background: white;
    }

    .suggestions li {
        padding: 8px;
        font-size: 1.125rem;
        border-bottom: 1px solid rgba(0,0,0,0.4);
        cursor: pointer;
    }

    .suggestions li:hover {
        background-color: rgba(58, 99, 120, 0.8);
    }

    .search-input {
        padding: 16px;
        font-size: 1.25rem;
        border: none;
        outline: none;
        border-right: 1px solid rgba(0,0,0,0.4);
        width: 100%;
    }

    select.search-input {
        padding: 15.5px;
    }

    .search-field:first-child {
        position: relative;
    }

    .search-field:first-child .search-input {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        position: relative;
    }

    .search-input option {
        font-size: 1rem;
    }

    .search-fields .submit {
        flex: 1;
        border: none;
        outline: none;
        width: 100%;
        font-size: 1.25rem;
        background: #083045;
        cursor: pointer;
        color: white;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .search-options {
        display: flex;
        justify-content: flex-start;
        margin-top: 20px;
        margin-left: 30px;
    }

    .search-options .checkbox-field {
        margin-right: 20px;
        display: flex;
        align-items: baseline;
    }

    .checkbox-field label {
        margin-left: 8px;
    }

    @media (max-width: 920px) {
        .search-fields {
            border-width: 10px;
        }

        .search-field .suggestions {
            top: 43px;
        }

        .search-input {
            padding: 12px;
            font-size: 1rem;
            border: none;
            outline: none;
            border-right: 1px solid rgba(0,0,0,0.4);
            width: 100%;
        }

        select.search-input {
            padding: 11.5px;
        }

        .search-fields .submit {
            font-size: 1rem;
        }

        .search-options {
            margin-left: 15px;           
        }

        .checkbox-field label {
            font-size: .875rem;
        }
    }

    @media (max-width: 622px) {
        .search-fields {
            border-width: 6px;
        }

        .search-field .suggestions {
            top: 33px;
        }

        .suggestions li {
            font-size: .875rem;
        }

        .search-input {
            padding: 8px;
            font-size: .875rem;
            border: none;
            outline: none;
            border-right: 1px solid rgba(0,0,0,0.4);
            width: 100%;
        }

        select.search-input {
            padding: 7px;
        }

        .search-fields .submit {
            font-size: .875rem;
        }

        .search-options {
            margin-left: 10px;           
        }

        .checkbox-field label {
            font-size: .775rem;
        }
    }

    @media (max-width: 468px) {
        .search-options {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            margin-left: 20px;
        }

        .search-options .checkbox-field {
            padding: 5px 0;
        }
    }

    @media (max-width: 400px) {
        .search-fields {
            border-width: 2px;
        }
        .search-form {
            margin: 15px 0;
        }

        .search-options .checkbox-field {
            padding: 2px 0;
        }
    }
</style>