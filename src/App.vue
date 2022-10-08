<template>
  <div class="app">
    <VisualEditor v-model="state" :formData="formData"></VisualEditor>
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
    const pageData = sessionStorage.getItem('pageData') ? JSON.parse(sessionStorage.getItem('pageData')) : data;

    const state = ref(pageData);

    provide('config', config); // provide 通信


    const formData = ref({
      username: 'Bao',
      password: 123123,
      start: 1,
      end: 200
    })

    return {
      state,
      formData
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
  // background-color: lightgray;
}
</style>
