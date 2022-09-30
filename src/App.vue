<template>
  <div class="app">
    <VisualEditor :data="state"></VisualEditor>
  </div>

</template>

<script>
import { ref } from 'vue';
import data from './data.json';
import VisualEditor from './packages/visual-editor'

export default {
  components: {
    VisualEditor
  },
  setup() {
    const state = ref(data);


    return {
      state
    }
  }
}

</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
.app {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
