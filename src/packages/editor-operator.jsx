import deepcopy from "deepcopy";
import { ElInput } from "element-plus";
import { ElColorPicker } from "element-plus";
import { ElOption } from "element-plus";
import { ElSelect } from "element-plus";
import { ElForm, ElFormItem, ElButton, ElInputNumber } from "element-plus";
import { watch } from "vue";
import { reactive } from "vue";
import { inject } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: {type: Object},
    data: {type: Object},
    updateContainer: {type: Function},
    updateBlock: {type: Function},
  },
  setup(props){
    const config = inject('config');
    const state = reactive({
      editData: {}
    });
    const reset = () => {
      if (!props.block) {
        state.editData = deepcopy(props.data.container);
      } else {
        state.editData = deepcopy(props.block);
        console.log(state.editData.props);
      }
    };

    const applyChanges = () => {
      if (!props.block) {
        props.updateContainer({...props.data, container: state.editData});
      } else {
        props.updateBlock(state.editData, props.block);
      }
    };

    watch(()=>props.block, reset, {immediate: true});

    return () => {
      let content = [];
      if (!props.block) {
        content.push(<>
          <ElFormItem label="容器宽度">
            <ElInputNumber v-model={state.editData.width}></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="容器高度">
            <ElInputNumber v-model={state.editData.height}></ElInputNumber>
          </ElFormItem>
        </>);
      } else {
        const component = config.componentsMap[props.block.type];
        if (component && component.props) {
          content.push(Object
            .entries(component.props)
            .map(([propName, propConfig])=>{
              return <ElFormItem label={propConfig.label}>
                {{
                  input: () => <ElInput v-model={state.editData.props[propName]}></ElInput>,
                  color: () => <ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                  select: () => <ElSelect v-model={state.editData.props[propName]}>
                    {propConfig.option.map(option => {
                      return <ElOption label={option.label} value={option.value}></ElOption>
                    })}
                  </ElSelect>

                }[propConfig.type]()}
              </ElFormItem>
            })
          );
        }
        if(component && component.model) {
          content.push(Object
            .entries(component.model)
            .map(([modelName, label]) => {
              return <ElFormItem label={label}>
                <ElInput v-model={state.editData.model[modelName]}></ElInput>
              </ElFormItem>
            })
          );
        }
      }
      
      return (
        <ElForm labelPosition="top" style="padding: 30px">
          {content}
          <ElFormItem>
            <ElButton type="primary" onClick={applyChanges}>应用</ElButton>
            <ElButton onClick={reset}>重置</ElButton>
          </ElFormItem>
        </ElForm>
      );
    }
  }

})