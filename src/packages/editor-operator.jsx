import { ElInput } from "element-plus";
import { ElColorPicker } from "element-plus";
import { ElOption } from "element-plus";
import { ElSelect } from "element-plus";
import { ElForm, ElFormItem, ElButton, ElInputNumber } from "element-plus";
import { inject } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: {type: Object},
    data: {type: Object},
  },
  setup(props){
    const config = inject('config');
    return () => {
      let content = [];
      if (!props.block) {
        content.push(<>
          <ElFormItem label="容器宽度">
            <ElInputNumber></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="容器高度">
            <ElInputNumber></ElInputNumber>
          </ElFormItem>
        </>);
      } else {
        const component = config.componentsMap[props.block.type];
        if (component && component.props) {
          content.push(Object
            .entries(component.props)
            .map(([propName, propConfig])=>{
              console.log(propName);
              return <ElFormItem label={propConfig.label}>
                {{
                  input: () => <ElInput></ElInput>,
                  color: () => <ElColorPicker></ElColorPicker>,
                  select: () => <ElSelect>
                    {propConfig.option.map(option => {
                      return <ElOption label={option.label} value={option.value}></ElOption>
                    })}
                  </ElSelect>

                }[propConfig.type]()}
              </ElFormItem>
            })
          );
        }
      }

      
      return (
        <ElForm labelPosition="top" style="padding: 30px">
          {content}
          <ElFormItem>
            <ElButton type="primary">应用</ElButton>
            <ElButton >重置</ElButton>
          </ElFormItem>
        </ElForm>
      );
    }
  }

})