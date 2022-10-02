import { inject } from "vue";
import { computed } from "vue";
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

    return () => {
      const component = config.componentsMap[props.block.type];
      const RenderComponent = component.render();
      return <div class="editor-block" style={blockStyles.value}>
        {RenderComponent}
      </div>
    }
    
  }
})