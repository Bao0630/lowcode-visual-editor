import { defineComponent } from "vue";
import './visual-editor.scss';

export default defineComponent({
  props: {
    data: { type: Object }
  },
  setup(props) {
    console.log(props.data);
    return () => <div class="editor">
      <div class="editor-material">wiliao</div>
      <div class="editor-menu">caidan</div>
      <div class="editor-panel">kongzhilan</div>
      <div class="editor-container">
        <div class="editor-container-canvas">
          <div class="editor-container-canvas__content">
            content
          </div>
          
        </div>
      </div>
    </div>
  }
})