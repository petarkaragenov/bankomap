<template>
  <div class="distance-popup">
      <div class="content">
          <p><strong>Разстояние: {{ distance }}</strong></p>
      </div>
      <div class="controls">
          <FontAwesomeIcon :icon="['fas', 'times']" @click="$emit('hidePopup')" />
      </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
    props: ['distance'],
    components: {
        FontAwesomeIcon
    }
}
</script>

<style scoped>
    .distance-popup {
        color: #3F454D;
        background: white;
        width: 15rem;
        padding: 10px;
        padding-right: 0;
        position: absolute;
        top: 40px;
        right: 40px;
        display: flex;
        z-index: 200;
        box-shadow: 0em 0 0.4em rgba(56, 56, 56, 0.6);
        border-radius: 8px;
    }

    .distance-popup .content {
        padding: 5px 10px;
        border-right: 1px solid rgba(0,0,0,0.3);
        flex: 1;
        font-size: 0.875rem;
    }

    .distance-popup .controls {
        padding: 5px 15px;
    }

    .fa-times {
        cursor: pointer;
        color: #3F454D !important;
    }

    @media (max-width: 920px) {
        .distance-popup {
            top: 86%;
            left: 5%;
        }
    }

    @media (max-width: 468px) {
        .distance-popup {
            top: 88%;
            width: 12.5rem;
        }

        .distance-popup .content {
            font-size: 0.775rem;
            padding: 3px 5px;
        }

        .distance-popup .controls {
            padding: 3px 10px;
        }
    }
</style>