<template>
  <div
    ref="bar"
    class="position-relative d-flex flex-column"
  >
    <div
      v-if="isMouseIn"
      ref="timeMark"
      class="position-absolute bottom-0 d-flex flex-column gap-2 align-items-center"
      role="tooltip"
      :style="timeMarkStyle"
    >
      <img
        v-if="closestFrame"
        :src="closestFrame"
        class="border-3 border-white border rounded-1"
        height="100"
        alt=""
      >

      <span class="text-white tooltip-inner bs-tooltip-top">
        {{ formattedExpectedTime }}
      </span>
    </div>
    <progress
      class="w-100 h-100"
      :max="duration"
      :value="time"
      :style="{
        '--buffered-gradient':bufferedIndicator,
        '--cursor-gradient': cursorGradient
      }"
      :aria-valuetext="formattedCurrentTime"
      @mousedown="scrubbing = true"
      @mouseenter="isMouseIn = true"
      @mouseleave="isMouseIn = false"
    />
  </div>
</template>


<script lang="ts">
import type {PropType} from 'vue';
import {computed, defineComponent, ref, watch} from 'vue';
import {useEventListener, useMouseInElement, useVModel} from '@vueuse/core';
import {getFormattedVideoTime} from '/@/utils/getFormattedVideoTime';


declare module 'csstype' {
  interface Properties {
    '--buffered-gradient'?: string;
    '--cursor-gradient'?: string;
  }
}


export default defineComponent({
  name: 'ProgressBar',
  props: {
    duration: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    buffered: {
      type: Array as PropType<[number, number][]>,
      required: false,
      default: () => ([]),
    },
    frames: {
      type: Object as PropType<{ step: number, map: Map<number, string> }>,
      required: false,
      default: () => ({
        step: 0,
        map: new Map,
      }),
    },
  },

  emits: {
    'update:time': (t: unknown) => typeof t === 'number',
  },

  setup(props, {emit}) {
    const bar = ref();
    const timeMark = ref<HTMLElement | undefined>();
    const isMouseIn = ref(false);
    const currentTime = useVModel(props, 'time', emit);

    const {elementX, elementWidth} = useMouseInElement(bar);

    const timeMarkStyle = computed(() => {
      const timeMarkWidth = (!timeMark.value ? 0 : timeMark.value.offsetWidth);
      const minimalPadding = 10;
      if (elementX.value <= elementWidth.value / 2) {
        const position = Math.max(elementX.value - (timeMarkWidth / 2), minimalPadding);
        return {
          left: `${position}px`,
        };
      } else {
        const position = Math.max(elementWidth.value - elementX.value - timeMarkWidth / 2, minimalPadding);
        return {
          right: `${position}px`,
        };
      }
    });

    const expectedTime = computed(() => {
      if (elementWidth.value) {
        return Math.max(0, Math.min(props.duration, (props.duration / elementWidth.value) * elementX.value));
      }

      return 0;
    });
    const formattedExpectedTime = computed(() => getFormattedVideoTime(expectedTime.value));

    const closestFrame = computed(() => {
      if (props.frames.step === 0) {
        return;
      }
      const t = Math.floor(expectedTime.value / props.frames.step) * props.frames.step + props.frames.step / 2;
      return props.frames.map.get(t);
    });


    /**
     * Buffered STATE
     */

    const defaultColorIndicator = 'rgba(255,255,255,0)';
    const bufferedColorIndicator = 'rgba(255,255,255,0.25)';

    const bufferedIndicator = computed(() => {
      if (props.buffered.length === 0) {
        return '';
      }
      const regions = props.buffered.flatMap(([start, end]) => {
        const startPercent = Math.floor(start / props.duration * 100);
        const endPercent = Math.floor(end / props.duration * 100);

        return [
          `${defaultColorIndicator} ${startPercent}%`,
          `${bufferedColorIndicator} ${startPercent}%`,
          `${bufferedColorIndicator} ${endPercent}%`,
          `${defaultColorIndicator} ${endPercent}%`,
        ];
      })
        .join(', ');

      return `linear-gradient(90deg, ${regions})`;
    });


    const cursorGradient = computed(() => {
      return isMouseIn.value
        ? `linear-gradient(90deg, ${bufferedColorIndicator} 0%, ${bufferedColorIndicator} ${elementX.value}px, ${defaultColorIndicator} ${elementX.value}px, ${defaultColorIndicator} 100%)`
        : '';
    });


    const currentTimePersint = computed(() => props.duration === 0 ? 0 : currentTime.value / props.duration);


    const scrubbing = ref(false);
    useEventListener('mouseup', () => scrubbing.value = false);
    watch([scrubbing, expectedTime], () => {
      if (scrubbing.value) {
        currentTime.value = expectedTime.value;
      }
    });

    const formattedCurrentTime = computed(() => getFormattedVideoTime(props.time));

    return {
      bar,
      timeMarkStyle,
      timeMark,
      formattedExpectedTime,
      bufferedIndicator,
      cursorGradient,
      currentTimePersint,
      scrubbing,
      isMouseIn,
      closestFrame,
      formattedCurrentTime,
    };
  },
});
</script>

<style scoped>
progress {
  appearance: none;
  cursor: pointer;
  transition: padding-top 0.5s;
}

progress:not(:hover) {
  padding-top: 12px;
}


progress::-webkit-progress-bar {
  border-radius: 2px;
  overflow: hidden;
  /*noinspection CssUnresolvedCustomProperty*/
  background: var(--cursor-gradient, none), var(--buffered-gradient, none) rgba(255, 255, 255, 0.25);
}


progress::-webkit-progress-value {
  background-color: var(--bs-red);
}

[role="tooltip"] {
  pointer-events: none !important;
  bottom: calc(100% + 10px);
  width: min-content;
  overflow-x: hidden;
}
</style>
