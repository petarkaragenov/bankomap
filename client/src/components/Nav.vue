<template>
    <nav>
      <router-link :to="link"><slot></slot></router-link>
    </nav>
</template>

<script>
export default {
  props: ['link']
}
</script>
