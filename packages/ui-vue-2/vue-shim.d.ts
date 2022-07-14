import Select from '@cohensive/select-core';

declare module 'vue/types/vue' {
  interface Vue {
    select: Select;
  }

  interface VueConstructor {
    select: Select;
  }
}
