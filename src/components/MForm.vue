<template>
  <FormFields :fields="fields" :form="modelValue" @updateField="updateField">
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </FormFields>
</template>

<script>
import FormFields from "./form/FormFields.vue";
import { get as safeGet, isObject, has } from "lodash";

export default {
  name: "MForm",

  components: { FormFields },

  props: {
    formData: { default: false },
    modelValue: { default: () => {} },
    fields: { default: () => [] },
    autoGenerate: { default: () => true },
  },

  data() {
    return {
      initialForm: {},
      form: {},
    };
  },

  created() {
    if (this.formData) this.initFormData();
  },

  watch: {
    fields: {
      immediate: true,
      handler(newFields) {
        const initialValue = {};
        this.form = newFields.reduce((obj, item) => {
          return {
            ...obj,
            [item["field"]]:
              "default" in item
                ? typeof item.default == "function"
                  ? item.default(this.formData)
                  : item.default
                : "",
          };
        }, initialValue);
        this.initialForm = this.form;
        this.autoGenerate && this.$emit("update:modelValue", { ...this.form });
      },
    },
    formData() {
      this.initFormData();
    },
  },

  methods: {
    async initFormData() {
      if (this.formData) {
        for (const prop in this.form) this.form[prop] = this.formData[prop];
        await this.fields.forEach((schema) => {
          const formItem = safeGet(this.form, "schema.field");

          if (isObject(schema) && has(schema, "normalize"))
            return (this.form[schema.field] = schema.normalize(formItem));

          if (formItem && isObject(formItem)) {
            if (!Array.isArray(formItem)) {
              this.form[schema.field] = schema.objKey
                ? safeGet(formItem, schema.objKey)
                : safeGet(formItem, "id");
            } else if (formItem.length > 0 && isObject(formItem[0])) {
              this.form[schema.field] = formItem.map((item) => {
                return schema.objKey ? item[schema.objKey] : item.id;
              });
            }
          }
        });
        this._event("callParentChanged");
      } else {
        this.form = { ...this.initialForm };
      }
      this._event("formFilled", { value: this.form });
      this.$emit("update:modelValue", { ...this.form });
    },

    updateField(schema) {
      const old = this.form[schema.field];
      this.form[schema.field] = schema.value;
      this._event("fieldChanged." + schema.field, {
        old,
        value: schema.value,
        instance: this,
      });
      this.$emit("update:modelValue", { ...this.form });
    },
  },
};
</script>
