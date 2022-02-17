<template>
  <input
    placeholder="test"
    :value="value"
    @input="(event) => updateField(event.target.value)"
  />
</template>

<script>
import FormFieldAbstract from "../form/FormFieldAbstract.vue";

export default {
  extends: FormFieldAbstract,
};
</script>
