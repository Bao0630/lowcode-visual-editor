<template>
  <div class="app">
    <VisualEditor v-model="state"></VisualEditor>
  </div>

</template>

<script>
import { provide, ref } from 'vue';
import data from './data.json';
import VisualEditor from './packages/visual-editor';
import {registerConfig as config} from './utils/editor-config';

export default {
  components: {
    VisualEditor
  },
  setup() {
    const state = ref(data);

    provide('config', config); // provide 通信


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
