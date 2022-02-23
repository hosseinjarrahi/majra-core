<template>
  <MForm :fields="fields" v-model="form" :form-data="formData" />
  <button @click="validate">validate</button>
  {{ res }}
</template>

<script setup>
/* eslint-disable no-unused-vars */

import TextField from "./components/exampleField/TextField.vue";
import MForm from "./components/MForm.vue";
import "./assets/tailwind.css";
import { reactive, ref } from "vue";
import { event } from "./plugins/mitt";

const form = ref({ name: "" });
const formData = ref({ name: "test" });
const res = ref({});

const fields = [
  {
    title: "نام محصول",
    field: "name",
    component: TextField,
    isHeader: true,
    validation(value) {
      return value.length > 5 || "غلطه";
    },
    col: { md: 12 },
    group: "اطلاعات محصول",
  },
];

function validate() {
  event("form.validate", res);
}
</script>
