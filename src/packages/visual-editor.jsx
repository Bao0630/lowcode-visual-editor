import { computed } from "vue";
import { inject } from "vue";
import { ref } from "vue";
import { defineComponent } from "vue";
import EditorBlock from "./editor-block";
import './visual-editor.scss';
import deepcopy from "deepcopy";
import { useComponentDragger } from "./useComponentDragger";
import { useFocus } from "./useFocus";
import { useBlockDragger } from "./useBlockDragger";

export default defineComponent({
  props: {
    modelValue: { type: Object }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    // console.log(props.modelValue);
    const data = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        context.emit('update:modelValue', deepcopy(value));
      }
    });

    const containerStyles = computed(() => ({
      width: `${data.value.container.width}px`,
      height: `${data.value.container.height}px`
    }));

    const blockUpdateHandler = (index, block) => {
      let blocks = data.value.blocks;
      blocks[index] = block;
      data.value = {
        ...data.value,
        blocks: [
          ...blocks
        ]
      };
    };

    const config = inject('config');

    const containerRef = ref(null);
    const { dragstart, dragend } = useComponentDragger(containerRef, data);
    const { blockMousedown, containerMousedown, focusData, lastSelectedBlock } = useFocus(data, (e) => mousedown(e));
    const { mousedown, markline } = useBlockDragger(data, focusData, lastSelectedBlock)



    return () => <div class="editor">
      <div class="editor-material">
        {config.componentsList.map(component => (
          <div
            class="editor-material-item"
            draggable
            onDragstart={e => dragstart(e, component)}
            onDragend={e => dragend(e)}
          >
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
        ))}
      </div>
      <div class="editor-menu">caidan</div>
      <div class="editor-panel">kongzhilan</div>
      <div class="editor-container">
        <div class="editor-container-canvas">
          <div
            class="editor-container-canvas__content"
            style={containerStyles.value}
            ref={containerRef}
            onMousedown={containerMousedown}
          >
            
            {
              (data.value.blocks.map((block, index) => (
                <EditorBlock
                  class={block.focus ? 'editor-block-focus' : ''}
                  block={block}
                  onMousedown={(e) => blockMousedown(e, block, index)}
                  updateBlock={blockUpdateHandler}
                  index={index}
                ></EditorBlock>
              )))
            }
            {markline.x !== null && <div class="markline-x" style={{ left: `${markline.x}px` }}></div>}
            {markline.y !== null && <div class="markline-y" style={{ top: `${markline.y}px` }}></div>}
          </div>
        </div>
      </div>
    </div>
  }
})