<template>
  <input
    class="border-2 border-indigo-600 rounded"
    :value="value"
    @input="(event) => updateField(event.target.value)"
  />
</template>

<script setup>
import { defineProps } from "vue";
import useFieldProps from "../../composables/useFieldProps";

defineProps(useFieldProps);
</script>
