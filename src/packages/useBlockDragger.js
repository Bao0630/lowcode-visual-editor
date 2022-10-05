import { reactive } from "vue";
import { events } from "./events";

export function useBlockDragger(data, focusData, lastSelectedBlock) {
  let dragState = {
    startX: 0,
    startY: 0,
    dragging: false
  }

  let markline = reactive({
    x: null,
    y: null
  })

  const mousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e;
    if (!dragState.dragging) {
      dragState.dragging = true;
      events.emit('start');
    }

    let left = moveX - dragState.startX + dragState.startLeft;
    let top = moveY - dragState.startY + dragState.startTop;
    let lineX = null;
    let lineY = null;
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { top: t, showTop: s } = dragState.lines.y[i];
      if (Math.abs(t - top) < 5) {
        lineY = s;
        moveY = dragState.startY - dragState.startTop + t;
        break;
      }
    }
    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: l, showLeft: s } = dragState.lines.x[i];
      if (Math.abs(l - left) < 5) {
        lineX = s;
        moveX = dragState.startX - dragState.startLeft + l;
        break;
      }
    }
    markline.x = lineX;
    markline.y = lineY;

    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY;
    focusData.value.focused.forEach((block, idx) => {
      block.top = dragState.startPos[idx].top + durY;
      block.left = dragState.startPos[idx].left + durX;
    })
  }

  const mouseup = () => {
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    markline.x = null;
    markline.y = null;
    if (dragState.dragging) {
      events.emit('end');
    }
  }

  const mousedown = (e) => {
    // console.log(lastSelectedBlock.value);

    const { width: BWidth, height: BHeight } = lastSelectedBlock.value;
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startTop: lastSelectedBlock.value.top,
      startLeft: lastSelectedBlock.value.left,
      dragging: false,
      startPos: focusData.value.focused.map(({ top, left }) => ({ top, left })),
      lines: (() => {
        const { unfocused } = focusData.value;
        let lines = { x: [], y: [] };
        [...unfocused,
        {
          top: 0,
          left: 0,
          width: data.value.container.width,
          height: data.value.container.height
        }
        ].forEach((block) => {
          try {
            if (BWidth === null || BHeight === null) throw new ReferenceError('Undefined Block B Size!');
            if (block.width === null || block.height === null || block.top === null || block.left === null) throw new ReferenceError('Undefined Block A Size!');
            const { top: ATop, left: ALeft, width: AWidth, height: AHeight } = block;
            lines.y.push({ showTop: ATop, top: ATop });
            lines.y.push({ showTop: ATop, top: ATop - BHeight });
            lines.y.push({ showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2 });
            lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight });
            lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight - BHeight });

            lines.x.push({ showLeft: ALeft, left: ALeft });
            lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth });
            lines.x.push({ showLeft: ALeft + AWidth / 2, left: ALeft + AWidth / 2 - BWidth / 2 });
            lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth - BWidth });
            lines.x.push({ showLeft: ALeft, left: ALeft - BWidth });
          } catch (e) {
            console.log(e);
          }
        });
        return lines;
        // console.log(lines)
      })()
    }
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  return {
    mousedown,
    markline
  }
}