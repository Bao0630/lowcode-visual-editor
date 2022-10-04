import { inject } from "vue";
import { ref, computed, onMounted } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: {type: Object},
    updateBlock: {type: Function},
    index: {type: Number}
  },
  setup(props) {
    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`
    }));

    const config = inject('config');

    const blockRef = ref(null);

    onMounted(() => {    
      let { offsetWidth, offsetHeight } = blockRef.value;
      let block = {
        ...props.block,
        width: offsetWidth,
        height: offsetHeight,
      };
      if (props.block.alignCenter) {
        block.left = props.block.left - offsetWidth/2;
        block.top = props.block.top - offsetHeight/2;
        block.alignCenter = false;
      }
      // block = Object.assign(props.block, block); // 应该通过事件更新
      // console.log(block);
      props.updateBlock(props.index, block);
    })

    return () => {
      const component = config.componentsMap[props.block.type];
      const RenderComponent = component.render();
      return <div class="editor-block" style={blockStyles.value} ref={blockRef}>
        {RenderComponent}
      </div>
    }
  }
})