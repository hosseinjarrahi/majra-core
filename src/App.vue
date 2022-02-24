<template>
  <MForm
    :fields="fields"
    v-model="form"
    :form-data="formData"
    name="registerForm"
  />
</template>

<script setup>
/* eslint-disable no-unused-vars */

import TextField from "./components/exampleField/TextField.vue";
import useMajra from "./composables/useMajra";
import MForm from "./components/MForm.vue";
import { ref, onBeforeMount } from "vue";
import "./assets/tailwind.css";

onBeforeMount(() => {
  const { registerFields } = useMajra();
  registerFields({
    text: TextField,
  });
});

const form = ref({ name: "" });
const formData = ref({ name: "test" });
const res = ref({});

const fields = [
  {
    title: "نام محصول",
    field: "name",
    component: "text",
    isHeader: true,
    validation(value) {
      return value.length > 5 || "غلطه";
    },
  },
];
</script>
