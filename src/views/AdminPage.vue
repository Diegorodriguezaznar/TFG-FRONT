<script setup lang="ts">
import AdminHeader from '@/components/Layout/HeaderAdmin.vue'
import AdminFooter from '@/components/Layout/FooterAdmin.vue'
import AdminMenuChips from '@/components/Private/AdminMenuChips.vue'
</script>

<template>
  <div class="admin-layout">
    <AdminHeader />
    <AdminMenuChips />

    <div class="admin-main">
      <div class="admin-content">
        <router-view />
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-main {
  display: flex;
  flex: 1;
}

.admin-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
}
</style>
