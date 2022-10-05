import { ElDialog, ElButton, ElInput } from "element-plus";
import { reactive } from "vue";
import { render } from "vue";
import { createVNode } from "vue";
import { defineComponent } from "vue";

const DialogComponent = defineComponent({
  props: {
    option: {type: Object}
  },
  setup(props, context) {
    const state = reactive({
      option: props.option,
      isShow: false,
    });

    context.expose({
      showDialog(option) {
        state.option = option;
        state.isShow = true;
      }
    });

    const onCancel = () => {
      state.isShow = false;
    }

    const onConfirm = () => {
      state.isShow = false;
      state.option.onConfirm && state.option.onConfirm(state.option.content);
    }

    return () => {
      return <ElDialog v-model={state.isShow} title={state.option.title}>
        {{
          default: () => <ElInput
            type="textarea"
            v-model={state.option.content}
            rows={10}
            ></ElInput>,
          footer: () => state.option.footer && <div>
            <ElButton onClick={onCancel}>取消</ElButton>
            <ElButton type="primary" onClick={onConfirm}>确定</ElButton>
          </div>
        }}
      </ElDialog>
    }
  }
});

let vm = null;

export function $dialog(option) {
  if (!vm) {
    let el = document.createElement('div');
    vm = createVNode(DialogComponent, {option});
    render(vm, el)
    document.body.appendChild(el);
  }
  

  let {showDialog} = vm.component.exposed;
  showDialog(option);
}