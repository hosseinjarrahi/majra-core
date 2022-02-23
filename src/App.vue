<template>
  <MForm :fields="fields" v-model="form" :form-data="formData" />
  <button @click="change">click</button>
</template>

<script setup>
import TextField from "./components/exampleField/TextField.vue";
import MForm from "./components/MForm.vue";
import "./assets/tailwind.css";
import { reactive, ref } from "vue";

const form = ref({ name: "" });
const formData = ref({ name: "test" });

const fields = reactive([
  {
    title: "نام محصول",
    field: "name",
    component: TextField,
    isHeader: true,
    col: { md: 12 },
    group: "اطلاعات محصول",
  },
]);

function change() {
  fields.push({
    title: "نام s",
    field: "namse",
    component: TextField,
    isHeader: true,
    col: { md: 12 },
    group: "اطلsاعات محصول",
  });
}
</script>
