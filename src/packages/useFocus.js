import { ref } from 'vue';
import { computed } from 'vue';

export function useFocus(data, callback) {
  const selectIndex = ref(-1);

  const lastSelectedBlock = computed(() => data.value.blocks[selectIndex.value]);

  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => block.focus = false)
  }
  const containerMousedown = () => {
    clearBlockFocus();
    selectIndex.value = -1;
  }

  const blockMousedown = (e, block, index) => {
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
    focusData,
    lastSelectedBlock
  }
}