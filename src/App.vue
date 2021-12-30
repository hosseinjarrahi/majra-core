<template>
  <MForm :fields="fields" v-model="form" />
</template>

<script>
import MForm from "./components/MForm.vue";
import TextField from "./components/test/TextField.vue";
import "./assets/tailwind.css";

export default {
  name: "App",

  components: { MForm },

  data: () => ({
    form: { name: "" },
    fields: [
      {
        title: "نام محصول",
        field: "name",
        component: TextField,
        isHeader: true,
        col: { md: 12 },
        group: "اطلاعات محصول",
      },
    ],
  }),
};
</script>
