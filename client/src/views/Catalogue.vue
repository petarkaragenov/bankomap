<template>
    <div class="container">
        <div class="logo">
            <router-link to="/">Банкомап</router-link>
        </div>
        <Nav link="/">&laquo; Начало</Nav>
        <div class="loading" v-if="!banks">
            <p>Зареждане...</p>
        </div>
        <main class="catalogue" v-if="banks">
            <h1>Банков Каталог</h1>

            <h2>1. Банки, лицензирани в България</h2>
            <Bank :source="banks.licensed" />

            <h2>2. Клонове на чужди банки в България</h2>
            <Bank :source="banks.foreign" />           
        </main>
    </div>
</template>

<script>
import Nav from '../components/Nav'
import Bank from '../components/Bank'

export default {
    components: {
        Nav, Bank
    },
    data() {
        return {
            banks: null
        }
    },
    created() {
        axios.get('http://localhost:3000/api/banks') 
            .then(res => this.banks = res.data)
            .catch(err => console.log(err))
    }
}
</script>

<style>

</style>