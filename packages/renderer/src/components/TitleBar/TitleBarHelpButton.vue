<script lang="ts" setup>
import {openGitHub, openTG, openVK} from '/@/use/socialLinks';
import {trackEvent} from '/@/utils/telemetry';


const SELECT_OPTIONS = [{
  id: 'telegram',
  label: 'В Telegram',
}, {
  id: 'vk',
  label: 'В VK',
}, {
  id: 'github',
  label: 'На GitHub',
}] as const;


const onSelected = (event: Event) => {
  console.log('onSelected', event);
  const select = event.target;

  if (!select || !(select instanceof HTMLSelectElement)) {
    throw new Error('Expected event with event.target as HTMLSelectElement');
  }

  const socialTarget = select.value as typeof SELECT_OPTIONS[number]['id'];
  switch (socialTarget) {
    case 'vk':
      openVK(true);
      break;
    case 'telegram':
      openTG(true);
      break;
    case 'github':
      openGitHub('discussions');
      break;
  }

  // Нужно сбросить значение,
  // чтобы при повторном выборе того же элемента сработало событие `input`
  select.value = '';

  trackEvent('New Issue', 'Click Title bar link', 'Помощь');
};
</script>

<template>
  <div
    class="position-relative btn rounded-0 py-0 border-0 text-primary title-bar-github-link d-sm-inline-flex d-none align-items-center justify-content-center"
  >
    <small class="text-truncate">
      Помощь
    </small>

    <select
      aria-label="Помощь"
      class="position-absolute top-0 left-0 w-100 h-100"
      value=""
      @input.prevent="onSelected"
    >
      <option
        v-for="option of SELECT_OPTIONS"
        :key="option.id"
        :value="option.id"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
@import "base-titlebar-button.css";

select {
  opacity: 0;
  cursor: pointer;
  color: inherit;
  background: var(--body-bg);
}

.btn:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
