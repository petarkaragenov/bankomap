<template>
  <div class="container">
    <Nav link="/catalogue">Банков Каталог &raquo;</Nav>
    <main class="search">
      <div class="search-wrapper">
        <h1 class="heading">Банкомап</h1>
        <h2 class="subheading">Справочник на банките и банковите офиси в България</h2>
        <SearchForm />
      </div>
    </main>
  </div>
</template>

<script>
import Nav from '../components/Nav'
import SearchForm from '../components/SearchForm'

export default {
  name: 'home',
  components: {
    SearchForm, Nav
  }
}
</script>
