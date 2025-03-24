<template>
  <div class="data-view">
    <h1>資料展示</h1>
    <DataDisplay />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataDisplay from '../components/DataDisplay.vue';

export default defineComponent({
  name: 'DataView',
  components: {
    DataDisplay
  }
});
</script>

<style scoped lang="scss">
.data-view {
  padding: 20px;
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
}
</style>