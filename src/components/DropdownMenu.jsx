import { reactive } from 'vue';
import { onMounted } from 'vue';
import { onBeforeUnmount } from 'vue';
import { inject } from 'vue';
import { provide } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { defineComponent } from 'vue';
import { createVNode, render } from 'vue';

export const DropdownItem = defineComponent({
  props: {
    label: String,
    icon: String,
  },
  setup(props) {
    // const {label, icon} = props;
    const hide = inject('hide');
    return () => <div class="dropdown-item" onClick={hide}>
      <i class={props.icon}></i>
      <span>{props.label}</span>
    </div>
  }
  
})

const DropdownComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, context) {
    const state = reactive({
      option: props.option,
      isShow: false,
      top: 0,
      left: 0

    });
    context.expose({
      showDropdown(option) {
        state.option = option;
        state.isShow = true;
        let { top, left, height } = option.el.getBoundingClientRect();
        state.top = top + height;
        state.left = left;

      }
    });

    provide('hide', () => {
      state.isShow = false
    });

    const classes = computed(() => [
      'dropdown', { 'dropdown-isShow': state.isShow }
    ]);
    const styles = computed(() => ({
      top: `${state.top}px`,
      left: `${state.left}px`
    }));


    const el = ref(null);

    const onMousedownDocument = (e) => {
      if (!el.value.contains(e.target)) {
        state.isShow = false;
      }
    };
    

    onMounted(() => {
      document.body.addEventListener('mousedown', onMousedownDocument, true);
    });
    onBeforeUnmount(() => {
      document.body.removeEventListener('mousedown', onMousedownDocument);
    });
    return () => {
      return <div class={classes.value} style={styles.value} ref={el}>
        {state.option.content()}
      </div>
    };

  }
});

let vm = null;

export function $dropdown(option) {
  if (!vm) {
    let el = document.createElement('div');
    vm = createVNode(DropdownComponent, { option });
    render(vm, el)
    document.body.appendChild(el);
  }


  let { showDropdown } = vm.component.exposed;
  showDropdown(option);
}