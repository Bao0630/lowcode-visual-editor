import { inject } from "vue";
import { ref, computed, onMounted } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: {type: Object}
  },
  setup(props) {
    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`
    }));

    const config = inject('config');
    console.log(config);

    const blockRef = ref(null);
    onMounted(() => {
      if (!props.block.alignCenter) return ;
      let { offsetWidth, offsetHeight } = blockRef.value;
      
      const block = props.block; // 应该通过事件更新
      block.left = block.left - offsetWidth/2;
      block.top = block.top - offsetHeight/2;
      block.alignCenter = false;
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