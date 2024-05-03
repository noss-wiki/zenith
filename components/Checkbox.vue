<script setup lang="ts">
import CheckIcon from '@/assets/icons/check.svg';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);
const checked = defineModel<boolean>();

function toggle() {
  if (props.disabled) return;
  checked.value = !checked.value;
}
</script>

<template>
  <div class="outer" :class="{ disabled }" @click="toggle">
    <div
      class="checkbox"
      role="checkbox"
      :disabled="disabled"
      :class="{ checked: modelValue }"
      :aria-checked="modelValue"
    >
      <CheckIcon class="check" />
    </div>
  </div>
</template>

<style scoped>
.outer {
  height: 1.5rem;
  width: 1.5rem;
  padding: 0.25rem;
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
  }
}

.checkbox {
  height: 1rem;
  width: 1rem;
  border-radius: var(--radius-small);
  border: 1px solid var(--color-text);
  display: grid;
  place-items: center;
  transition: border 0.3s ease, background 0.3s ease;

  &.checked {
    background: var(--color-primary);
    border: 1px solid var(--color-primary);
  }

  & .check {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.checked .check {
    opacity: 1;
  }
}
</style>
