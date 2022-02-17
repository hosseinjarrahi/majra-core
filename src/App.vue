<template>
  <MForm :fields="fields" v-model="form" />
</template>

<script setup>
import MForm from "./components/MForm.vue";
import TextField from "./components/exampleField/TextField.vue";
import "./assets/tailwind.css";
import { ref } from "vue";

const form = ref({ name: "" });

const fields = [
  {
    title: "نام محصول",
    field: "name",
    component: TextField,
    isHeader: true,
    col: { md: 12 },
    group: "اطلاعات محصول",
  },
];
</script>
