<script setup lang="ts">
withDefaults(
  defineProps<{
    expandable?: boolean;
  }>(),
  {
    expandable: false,
  }
);
</script>

<template>
  <div class="account">
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
.account {
  width: 100%;
}

.button {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: var(--radius-default);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--color-bg);
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
  background: var(--color-primary);
  border-radius: var(--radius-small);
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

.dropdown {
  position: absolute;
  bottom: 3.5rem;
  left: 0;
  width: 100%;
  height: 10rem;
  background: var(--color-raised-surface);
  border-radius: var(--radius-default);
}
</style>
