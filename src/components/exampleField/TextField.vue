<template>
  <input
    class="border-2 border-indigo-600 rounded"
    :value="value"
    @blur="(event) => updateField(event.target.value)"
  />
  <span class="text-red-900" v-if="error">
    {{ error }}
  </span>
</template>

<script setup>
import { defineProps } from "vue";
import useFieldProps from "../../composables/useFieldProps";

defineProps(useFieldProps);
</script>
