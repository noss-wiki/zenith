<script setup lang="ts">
import Arrow from './icons/Arrow.vue';

withDefaults(
  defineProps<{
    expandable?: boolean;
  }>(),
  {
    expandable: false,
  }
);

/* const open = ref(false);
let button: HTMLElement;
let dropdown: HTMLElement;

const handler = (e: MouseEvent) => {
  if (button.contains(e.target as Node)) open.value = !open.value;
  else if (!dropdown.contains(e.target as Node)) {
    open.value = false;
  }
};

onMounted(() => document.addEventListener('click', handler));
onUnmounted(() => document.removeEventListener('click', handler)); */
</script>

<template>
  <div class="wrapper">
    <div class="button">
      <div class="info">
        <div class="icon">R</div>
        <span class="name">Robin de Vos</span>
      </div>
      <!-- <Arrow v-if="$props.expandable" style="rotate: 180deg" /> -->
    </div>
    <!-- <Transition mode="in-out" name="fade">
      <div
        class="dropdown"
        ref="dropdown"
        v-show="$props.expandable && open"
      ></div>
    </Transition> -->
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
}

.button {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--background);
  }
}

.info {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  background: var(--accent);
  border-radius: 0.25rem;
  font-weight: 500;
  display: grid;
  place-items: center;
}

.info-stack {
  display: flex;
  flex-direction: column;
}

span.name {
  font-weight: 500;
}

span.members {
  color: var(--link-inactive);
  font-size: 0.75rem;
  margin-top: -0.3rem;
}

.dropdown {
  position: absolute;
  bottom: 3.5rem;
  left: 0;
  width: 100%;
  height: 10rem;
  background: var(--surface-secondary);
  border-radius: 0.5rem;
}
</style>
