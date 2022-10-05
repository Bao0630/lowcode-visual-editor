import { ref } from 'vue';
import { computed } from 'vue';

export function useFocus(data, previewRef, callback) {
  const selectIndex = ref(-1);

  const lastSelectedBlock = computed(() => data.value.blocks[selectIndex.value]);

  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => block.focus = false)
  }
  const containerMousedown = () => {
    if (previewRef.value) return ;
    clearBlockFocus();
    selectIndex.value = -1;
  }

  const blockMousedown = (e, block, index) => {
    if (previewRef.value) return ;
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      if(focusData.value.focused.length < 2) {
        block.focus = true;
      } else {
        block.focus = !block.focus;
      }
    } else if (!block.focus) {
      clearBlockFocus();
      block.focus = true;
    }
    selectIndex.value = index;
    callback(e);
  }

  const focusData = computed(() => {
    let focused = [];
    let unfocused = [];
    data.value.blocks.forEach(blcok => (blcok.focus ? focused : unfocused).push(blcok));
    return { focused, unfocused }
  })

  return {
    blockMousedown,
    containerMousedown,
    clearBlockFocus,
    focusData,
    lastSelectedBlock
  }
}