<template>
  <a-layout-footer class="footer">
    <div class="footer-content" />
  </a-layout-footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  background: var(--color-background);
  padding: 16px 20px;
  margin-top: 0;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
