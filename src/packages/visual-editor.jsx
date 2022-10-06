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
import { useCommand } from "./useCommand";
import { $dialog } from "@/components/DialogForm";
import { $dropdown, DropdownItem } from "@/components/DropdownMenu";
import EditorOperator from "./editor-operator";
import { ElButton } from "element-plus";

export default defineComponent({
  props: {
    modelValue: { type: Object },
    formData: {type: Object}
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const previewRef = ref(false);
    const editorRef = ref(true)

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
    const { blockMousedown, containerMousedown, clearBlockFocus, focusData, lastSelectedBlock } = useFocus(data, previewRef, (e) => mousedown(e));
    const { mousedown, markline } = useBlockDragger(data, focusData, lastSelectedBlock)


    const buttons = [
      { label: '撤销', icon: 'icon-back', handler: () => commands.undo() },
      { label: '重做', icon: 'icon-forward', handler: () => commands.redo() },
      {
        label: '导入', icon: 'icon-import', handler: () => {
          $dialog({
            title: '导入 JSON',
            content: '',
            footer: true,
            onConfirm(text) {
              // data.value = JSON.parse(text);
              commands.updateContainer(JSON.parse(text));
            }
          });

        }
      },
      {
        label: '导出', icon: 'icon-export', handler: () => {
          $dialog({
            title: '导出 JSON',
            content: JSON.stringify(data.value),
            footer: false
          });
        }
      },
      { label: '置顶', icon: 'icon-place-top', handler: () => commands.placeTop() },
      { label: '置底', icon: 'icon-place-bottom', handler: () => commands.placeBottom() },
      { label: '删除', icon: 'icon-delete', handler: () => commands.delete() },
      {
        label: () => previewRef.value ? '编辑' : '预览',
        icon: () => previewRef.value ? 'icon-edit' : 'icon-browse',
        handler: () => {
          previewRef.value = !previewRef.value;
          clearBlockFocus();
        }
      },
      {
        label: '关闭', icon: 'icon-close', handler: () => {
          editorRef.value = false;
          clearBlockFocus();
        }
      },
      {
        label: '保存', icon: 'icon-save', handler: () => {
          alert('保存');
        }
      },

    ];

    const { commands } = useCommand(data, focusData);

    const onContextMenuBlock = (e, block) => {
      e.preventDefault();
      $dropdown({
        el: e.target,
        content: () => {
          return <div>
            <DropdownItem label="删除" icon="icon-delete" onClick={() => commands.delete()}></DropdownItem>
            <DropdownItem label="置顶" icon='icon-place-top' onClick={() => commands.placeTop()}></DropdownItem>
            <DropdownItem label="置底" icon='icon-place-bottom' onClick={() => commands.placeBottom()}></DropdownItem>
            <DropdownItem label="查看" icon='icon-place-browse' onClick={() => {
              $dialog({
                title: '查看组件数据',
                content: JSON.stringify(block)
              })
            }}></DropdownItem>
            <DropdownItem label="导入" icon='icon-place-import' onClick={() => {
              $dialog({
                title: '导入组件数据',
                content: '',
                footer: true,
                onConfirm(text) {
                  text = JSON.parse(text);
                  commands.updateBlock(text, block);
                }
              })
            }}></DropdownItem>

          </div>
        },
      });
    }

    return () => !editorRef.value ? <>
      <div
        class="editor-container-canvas__content"
        style={containerStyles.value}
      >
        {
          (data.value.blocks.map((block) => (
            <EditorBlock
              class={'editor-block-preview'}
              block={block}
              formData={props.formData}
            ></EditorBlock>
          )))
        }
      </div>
      <div style="position: fixed; top:0; left:0;">
        <ElButton type="info" onClick={() => editorRef.value = true}>
          返回编辑
        </ElButton>
        {JSON.stringify(props.formData)}
      </div>
    </>
      :
      <div class="editor">
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
        <div class="editor-menu">
          {buttons.map((btn) => {
            const icon = typeof btn.icon == 'function' ? btn.icon() : btn.icon;
            const label = typeof btn.label == 'function' ? btn.label() : btn.label;
            return <div class="editor-menu-button" onClick={btn.handler}>
              <i class={icon}></i>
              <span>{label}</span>
            </div>
          })}
        </div>
        <div class="editor-panel">
          <EditorOperator
            block={lastSelectedBlock.value}
            data={data.value}
            updateContainer={commands.updateContainer}
            updateBlock={commands.updateBlock}
          ></EditorOperator>
        </div>
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
                    class={(block.focus ? 'editor-block-focus' : '') + (previewRef.value ? 'editor-block-preview' : '')}
                    block={block}
                    onMousedown={(e) => blockMousedown(e, block, index)}
                    onContextmenu={(e) => onContextMenuBlock(e, block)}
                    updateIndexBlock={blockUpdateHandler}
                    index={index}
                    formData={props.formData}
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