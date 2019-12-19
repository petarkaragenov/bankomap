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

<style scoped>
    .catalogue {
        margin: 100px 0 40px;
        background: white;
        color: black;
        box-shadow: 0 0 6px rgba(0,0,0,0.5) 0 0 14px rgba(0,0,0,0.3) 0 0 22px rgba(0,0,0,0.1);
        width: 100%;
        padding: 20px;
    }

    .catalogue h1 {
        font-size: 3.1rem;
        text-transform: uppercase;
        letter-spacing: 4px;
        text-align: center;
        padding: 10px 0 30px;
    }

    .catalogue h2:last-of-type {
        margin-top: 40px;
    }

    @media (max-width: 920px) {
        .catalogue {
            margin-top: 70px;
        }

        .catalogue h1 {
            font-size: 2.6rem;
        }

        .catalogue h2 {
            font-size: 1.25rem;
        }
    }

    @media (max-width: 622px) {
        .catalogue {
            margin-top: 70px;
            margin-bottom: 20px;
            padding: 10px;
        }

        .catalogue h1 {
            font-size: 2rem;
        }

        .catalogue h2 {
            font-size: 1.125rem;
        }
    }

    @media (max-width: 468px) {
        .catalogue {
            margin-top: 60px;
            margin-bottom: 2px;
        }
    }

    @media (max-width: 400px) {
        .catalogue h1 {
            font-size: 1.75rem;
            letter-spacing: 1px;
        }

        .catalogue h2 {
            font-size: 1rem;
        }
    }
</style>