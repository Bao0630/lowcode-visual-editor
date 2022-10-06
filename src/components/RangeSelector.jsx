import { computed } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    start: {type: Number},
    end: {type: Number}
  },
  emits: ['update:start', 'update:end'],
  setup(props, context) {
    const start = computed({
      get() {
        return props.start;
      },
      set(val) {
        context.emit('update:start', val);
      }
    });
    const end = computed({
      get() {
        return props.end;
      },
      set(val) {
        context.emit('update:end', val);
      }
    });

    return () => (<div class="range-selector">
      <input type="text" v-model={start.value}></input>
      <span>~</span>
      <input type="text" v-model={end.value}></input>
    </div>)

  }
})