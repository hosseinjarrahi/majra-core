<template>
  <FormOperator :fields="fields" :form="modelValue" @updateField="updateField">
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </FormOperator>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import useFillForm from "../composables/useFillForm";
import FormOperator from "./form/FormOperator.vue";

const props = defineProps({
  formData: { default: false },
  modelValue: { default: () => {} },
  fields: { default: () => [] },
  autoGenerate: { default: () => true },
});

const emit = defineEmits(["callParentChanged", "update:modelValue"]);

const { updateField } = useFillForm({
  props,
  emit,
});
</script>
