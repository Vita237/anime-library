<script lang="ts" setup>
import type {PropType} from 'vue';

defineProps({
  states: {
    type: Array as PropType<string[]>,
    required: true,
  },

  modelValue: {
    type: String,
    required: false,
    default: '',
  },

  groupName: {
    type: String,
    required: true,
  },
});

defineEmits({
  'update:modelValue': null,
});
</script>

<template>
  <span class="position-relative">
    <input
      v-for="state of states"
      :key="state"
      :checked="state === modelValue"
      :value="state"
      type="radio"
      :name="groupName"
      @change="$emit('update:modelValue', state)"
    >
    <slot />
  </span>
</template>

<style scoped>
input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  appearance: none;
  cursor: pointer;
}

input + input {
  z-index: -1;
}

input + input + input {
  z-index: -2;
}

input:checked + input {
  z-index: 1;
}
</style>
