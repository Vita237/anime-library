<script lang="ts" setup>
import type {PropType} from 'vue';
import {onMounted, ref} from 'vue';
import type {AnimeCollection} from '/@/pages/Home/AnimeCollection/AnimeCollectionDB';
import {onClickOutside} from '@vueuse/core';
import GenresSelector from '/@/pages/Home/AnimeCollection/GenresSelector.vue';


const props = defineProps({
  header: {
    type: String,
    required: false,
    default: '',
  },

  title: {
    type: String,
    required: false,
    default: '',
  },

  requestParams: {
    type: Object as PropType<AnimeCollection['requestParams']>,
    required: false,
    default: () => ({
      limit: 10,
      status: '',
      kind: '',
      order: 'ranked',
      mylist: '',
      genre: '',
    }),
  },

  onDelete: {
    type: Function,
    required: false,
    default: undefined,
  },
});

const emit = defineEmits({
  'save': null,
  'close': null,
  'delete': null,
});


const root = ref<HTMLElement>();
onClickOutside(root, () => emit('close'));

onMounted(() => root.value?.querySelector<HTMLInputElement>('input[autofocus]')?.focus());

const listTitle = ref(props.title);
const listLimit = ref(props.requestParams.limit);
const status = ref(props.requestParams.status.split(',').filter(s => !!s));
const kind = ref(props.requestParams.kind.split(',').filter(s => !!s));
const order = ref(props.requestParams.order);

const myList = ref(props.requestParams.mylist.split(',').filter(s => !!s).map(s => s.startsWith('!') ? s.substring(1) : s));
const myListType = ref(props.requestParams.mylist && !props.requestParams.mylist.startsWith('!') ? 'include' : 'exclude');

const genre = ref<[number, 'include' | 'exclude'][]>(
  props.requestParams.genre
    ? props.requestParams.genre
      .split(',')
      .filter(s => !!s)
      .map(s => s.startsWith('!') ? [Number(s.slice(1)), 'exclude'] : [Number(s), 'include'])
    : [],
);

const onSave = () => {
  const newList: AnimeCollection = {
    title: listTitle.value,
    requestParams: {
      limit: listLimit.value,
      status: status.value.join(','),
      kind: kind.value.join(','),
      order: order.value,
      mylist: (
        myListType.value === 'include' ? myList.value : myList.value.map(s => `!${s}`)
      ).join(','),
      genre: genre.value.reduce((s, [id, state]) => s + (state === 'exclude' ? '!' : '') + id + ',', ''),
    },
  };

  emit('save', newList);
};
</script>

<template>
  <dialog
    ref="root"
    open
    class="p-0 border-0 shadow-lg"
    aria-labelledby="modal-title"
  >
    <form
      class="card"
      @submit.prevent="onSave"
    >
      <div class="card-header d-flex align-items-center">
        <h5
          id="modal-title"
          class="card-title flex-fill m-0"
        >
          {{ header }}
        </h5>
        <button
          type="button"
          class="btn btn-light win-icon"
          title="Отменить изменения"
          aria-label="Отменить изменения"
          @click="$emit('close')"
        >
          &#xE8BB;
        </button>
      </div>
      <div class="card-body">
        <p class="form-text mt-0">
          Укажите критерии для коллекции. Все аниме будут автоматически собираться по этим критериям и обновляться раз в
          несколько дней.
        </p>

        <fieldset class="row">
          <div class="col-md">
            <label
              for="group-title"
              class="form-label"
            >Название коллекции</label>
            <input
              id="group-title"
              v-model="listTitle"
              type="text"
              name="group-title"
              class="form-control mb-2"
              autofocus
            >
          </div>

          <div class="col-md">
            <label
              for="limit"
              class="form-label"
            >Максимум результатов</label>
            <input
              id="limit"
              v-model.number="listLimit"
              type="number"
              min="1"
              max="50"
              name="limit"
              class="form-control"
            >
          </div>
        </fieldset>

        <div class="row">
          <div class="col-md">
            <fieldset class="mt-2">
              <legend>Тип</legend>

              <div class="form-check">
                <input
                  id="tv"
                  v-model="kind"
                  value="tv"
                  type="checkbox"
                  class="form-check-input"
                  name="kind"
                >
                <label
                  class="form-check-label"
                  for="tv"
                >TV Сериал</label>
              </div>

              <div class="form-check">
                <input
                  id="movie"
                  v-model="kind"
                  value="movie"
                  type="checkbox"
                  class="form-check-input"
                  name="kind"
                >
                <label
                  class="form-check-label"
                  for="movie"
                >Фильм</label>
              </div>


              <div class="form-check">
                <input
                  id="ova"
                  v-model="kind"
                  value="ova"
                  type="checkbox"
                  class="form-check-input"
                  name="kind"
                >
                <label
                  class="form-check-label"
                  for="ova"
                >OVA</label>
              </div>

              <div class="form-check">
                <input
                  id="ona"
                  v-model="kind"
                  value="ona"
                  type="checkbox"
                  class="form-check-input"
                  name="kind"
                >
                <label
                  class="form-check-label"
                  for="ona"
                >ONA</label>
              </div>

              <div class="form-check">
                <input
                  id="special"
                  v-model="kind"
                  value="special"
                  type="checkbox"
                  class="form-check-input"
                  name="kind"
                >
                <label
                  class="form-check-label"
                  for="special"
                >Спешл</label>
              </div>
            </fieldset>
            <fieldset class="mt-2">
              <legend>Статус</legend>

              <div class="form-check">
                <input
                  id="ongoing"
                  v-model="status"
                  value="ongoing"
                  type="checkbox"
                  class="form-check-input"
                  name="status"
                >
                <label
                  class="form-check-label"
                  for="ongoing"
                >Сейчас выходит</label>
              </div>

              <div class="form-check">
                <input
                  id="released"
                  v-model="status"
                  value="released"
                  type="checkbox"
                  class="form-check-input"
                  name="status"
                >
                <label
                  class="form-check-label"
                  for="released"
                >Вышедшее</label>
              </div>
              <div class="form-check">
                <input
                  id="latest"
                  v-model="status"
                  value="latest"
                  type="checkbox"
                  class="form-check-input"
                  name="status"
                >
                <label
                  class="form-check-label"
                  for="latest"
                >Недавно вышедшие</label>
              </div>
            </fieldset>
            <fieldset class="mt-2">
              <legend>Сортировка</legend>

              <div class="form-check">
                <input
                  id="ranked"
                  v-model="order"
                  value="ranked"
                  type="radio"
                  class="form-check-input"
                  name="order"
                >
                <label
                  class="form-check-label"
                  for="ranked"
                >По рейтингу</label>
              </div>

              <div class="form-check">
                <input
                  id="popularity"
                  v-model="order"

                  value="popularity"
                  type="radio"
                  class="form-check-input"
                  name="order"
                >
                <label
                  class="form-check-label"
                  for="popularity"
                >По популярности</label>
              </div>
              <div class="form-check">
                <input
                  id="aired_on"
                  v-model="order"
                  value="aired_on"
                  type="radio"
                  class="form-check-input"
                  name="order"
                >
                <label
                  class="form-check-label"
                  for="aired_on"
                >По дате выхода</label>
              </div>
            </fieldset>
            <fieldset class="mt-2">
              <legend>Мой Список Shikimori</legend>

              <div class="form-check">
                <input
                  id="exclude"
                  v-model="myListType"
                  value="exclude"
                  type="radio"
                  class="form-check-input"
                  name="my-list-type"
                >
                <label
                  class="form-check-label"
                  for="exclude"
                >Исключить всё из списков:</label>
              </div>

              <div class="form-check">
                <input
                  id="include"
                  v-model="myListType"
                  value="include"
                  type="radio"
                  class="form-check-input"
                  name="my-list-type"
                >
                <label
                  class="form-check-label"
                  for="include"
                >Включить только из списков:</label>
              </div>

              <div class="form-check mt-3">
                <input
                  id="planned"
                  v-model="myList"
                  value="planned"
                  type="checkbox"
                  class="form-check-input"
                  name="my-list"
                >
                <label
                  class="form-check-label"
                  for="planned"
                >Запланировано</label>
              </div>

              <div class="form-check">
                <input
                  id="watching"
                  v-model="myList"
                  value="watching"
                  type="checkbox"
                  class="form-check-input"
                  name="my-list"
                >
                <label
                  class="form-check-label"
                  for="watching"
                >Смотрю</label>
              </div>

              <div class="form-check">
                <input
                  id="rewatching"
                  v-model="myList"
                  value="rewatching"
                  type="checkbox"
                  class="form-check-input"
                  name="my-list"
                >
                <label
                  class="form-check-label"
                  for="rewatching"
                >Пересматриваю</label>
              </div>


              <div class="form-check">
                <input
                  id="completed"
                  v-model="myList"
                  value="completed"
                  type="checkbox"
                  class="form-check-input"
                  name="my-list"
                >
                <label
                  class="form-check-label"
                  for="completed"
                >Просмотрено</label>
              </div>

              <div class="form-check">
                <input
                  id="on_hold"
                  v-model="myList"
                  value="on_hold"
                  type="checkbox"
                  class="form-check-input"
                  name="my-list"
                >
                <label
                  class="form-check-label"
                  for="on_hold"
                >Отложено</label>
              </div>
              <div class="form-check">
                <input
                  id="dropped"
                  v-model="myList"
                  value="dropped"
                  type="checkbox"
                  class="form-check-input"
                  name="my-list"
                >
                <label
                  class="form-check-label"
                  for="dropped"
                >Брошено</label>
              </div>
            </fieldset>
          </div>
          <fieldset class="col-md">
            <legend>Жанры</legend>
            <genres-selector v-model="genre" />
          </fieldset>
        </div>
      </div>
      <div class="card-footer d-flex align-items-center">
        <button
          v-if="onDelete"
          type="button"
          class="btn btn-outline-danger win-icon"
          title="Удалить коллекцию"
          aria-label="Удалить коллекцию"
          @click="$emit('delete')"
        >
          &#xE74D;
        </button>
        <button
          type="submit"
          class="btn btn-primary"
        >
          Сохранить коллекцию
        </button>
      </div>
    </form>
  </dialog>
</template>


<style scoped>
dialog {
  z-index: 1060;
  transform: translateY(-50%);
  top: 50%;
  max-height: 100vh;
  overflow-y: auto;
  width: 100%;
  max-width: 630px;
  color: inherit;
  background: transparent;
}

dialog::backdrop {
  background-color: #448;
}

dialog button[type=submit] {
  margin-left: auto;
}

.card-header button {
  -webkit-app-region: no-drag;
}
</style>
