import { computed } from 'vue';

export function useFocus(data, callback) {
  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => block.focus = false)
  }
  const containerMousedown = () => {
    clearBlockFocus();
  }
  const blockMousedown = (e, block) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      block.focus = !block.focus;
    } else if (!block.focus) {
      clearBlockFocus();
      block.focus = true;
    } else {
      block.focus = false;
    }
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
    focusData
  }
}