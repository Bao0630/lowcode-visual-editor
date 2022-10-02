import { computed } from "vue";
import { inject } from "vue";
import { defineComponent } from "vue";
import EditorBlock from "./editor-block";
import './visual-editor.scss';

export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  setup(props) {
    console.log(props.modelValue);
    const data = computed({
      get() {
        return props.modelValue
      }

    });

    const containerStyles = computed(() => ({
      width: `${data.value.container.width}px`,
      height: `${data.value.container.height}px`
    }));

    const config = inject('config');

    return () => <div class="editor">
      <div class="editor-material">
        {config.componentsList.map(component => (
          <div class="editor-material-item">
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
        ))}
      </div>
      <div class="editor-menu">caidan</div>
      <div class="editor-panel">kongzhilan</div>
      <div class="editor-container">
        <div class="editor-container-canvas">
          <div class="editor-container-canvas__content" style={containerStyles.value}>
            {
              (data.value.blocks.map(block => (
                <EditorBlock block={block}></EditorBlock>
              )))
            }
          </div>
          
        </div>
      </div>
    </div>
  }
})