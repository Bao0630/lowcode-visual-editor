import RangeSelector from '@/components/RangeSelector';
import { ElButton, ElInput } from 'element-plus'

function createComponentsConfig() {
  const componentsList = [];
  const componentsMap = {};

  return {
    componentsList,
    componentsMap,
    register: (component) => {
      componentsList.push(component);
      componentsMap[component.type] = component;
    }
  };
}

export let registerConfig = createComponentsConfig();

const createInputProp = label => ({
  type: 'input',
  label
});
const createColorProp = label => ({
  type: 'color',
  label
});
const createSelectProp = (label, option) => ({
  type: 'select',
  label,
  option
})

console.log(registerConfig);
const placeholderImgSite = "https://dummyimage.com/";

registerConfig.register({
  label: '文本',
  preview: () => 'TextArea prewview',
  render: ({ props }) => <span style={{ color: props.color, fontSize: props.size }}>{props.text || '文本'}</span>,
  type: 'text',
  props: {
    text: createInputProp('输入文本内容'),
    color: createColorProp('字体颜色'),
    size: createSelectProp('字体大小', [
      { label: '12px', value: '12px' },
      { label: '14px', value: '14px' },
      { label: '16px', value: '16px' },
      { label: '18px', value: '18px' },
      { label: '20px', value: '20px' },
      { label: '24px', value: '24px' },
      { label: '28px', value: '28px' }
    ]),
  }

});
registerConfig.register({
  label: '按钮',
  resize: {
    width: true,
    height: true
  },
  preview: () => <ElButton type="primary">Button</ElButton>,
  render: ({ props, size }) => <ElButton
    style={{ height: `${size.height}px`, width: `${size.width}px` }}
    type={props.type}
    size={props.size}
  >
    {props.text || '按钮'}
  </ElButton>,
  type: 'button',
  props: {
    text: createInputProp('输入按钮内容'),
    type: createSelectProp('按钮类型', [
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
      { label: '信息', value: 'info' },
    ]),
    size: createSelectProp('按钮尺寸', [
      { label: '中等（默认）', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' },

    ]),

  },
});
registerConfig.register({
  label: '输入框',
  resize: {
    width: true
  },
  preview: () => <ElInput placeholder="text"></ElInput>,
  render: ({ model, size }) => <ElInput
    placeholder="text"
    {...model.default}
    style={{ width: `${size.width}px` }}
  ></ElInput>,
  type: 'input',
  model: {
    default: '绑定字段'
  }
});

registerConfig.register({
  label: '范围选择器',
  preview: () => <RangeSelector placeholder="text"></RangeSelector>,
  render: ({ model }) => {
    return <RangeSelector
      {...{
        start: model.start.modelValue,
        end: model.end.modelValue,
        'onUpdate:start': model.start['onUpdate:modelValue'],
        'onUpdate:end': model.end['onUpdate:modelValue'],
      }}

    ></RangeSelector>
  },
  type: 'range',
  model: {
    start: '开始范围',
    end: '结束范围'
  }
});

registerConfig.register({
  label: '图片',
  resize: {
    width: true,
    height: true
  },
  preview: () => <img src={`${placeholderImgSite}100x50`}></img>,
  render: ({ props, size }) => <img
    src={props.text || `${placeholderImgSite}${size.width}x${size.height}`}
    alt="img"
    style={{ height: `${size.height}px`, width: `${size.width}px` }}
  ></img>,
  type: 'image',
  props: {
    text: createInputProp('输入图片链接'),
  },
});

registerConfig.register({
  label: '视频',
  resize: {
    width: true,
    height: true
  },
  preview: () => '视频',
  render: ({ props, size }) => <video
    src={props.text}
    controls="controls"
    style={{ height: `${size.height}px`, width: `${size.width}px` }}
    ></video>,
  props: {
    text: createInputProp('输入视频链接'),
  },
  type: 'video'
});