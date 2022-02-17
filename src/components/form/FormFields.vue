<template>
  <div class="flex flex-wrap">
    <component
      v-for="(fields, key) in sortedFields"
      :is="Array.isArray(fields) ? 'FieldSet' : 'div'"
      class="d-flex flex-wrap"
      :label="key"
      :key="key"
    >
      <div
        v-for="(schema, index) in Array.isArray(fields) ? fields : [fields]"
        class="my-0 p-1 w-full"
        :key="schema.field"
        v-bind="getSafe(schema, 'class', {})"
      >
        <component
          :index="index"
          v-bind="bind(schema)"
          :is="getComponent(schema)"
          @mounted="mounted(schema.field)"
        />
      </div>
    </component>
  </div>
</template>

<script>
import { sortBy, has, flatten, get as getSafe } from "lodash";
const FieldSet = () => import("./../utilities/FieldSet");
import { event, listen } from "./../../plugins/mitt";

export default {
  name: "FormFields",

  props: ["fields", "form", "index"],

  components: { FieldSet },

  data() {
    return {
      filters: {},
      sharedData: {},
    };
  },

  methods: {
    getSafe,

    mounted(field) {
      event("mounted." + field, {
        item: this.form,
        field: field,
      });
    },

    created() {
      listen("resetFilters", () => {
        this.filters = {};
      });
    },

    bind(schema) {
      return {
        updateField: (value) => this.updateField(schema, value),
        parentChanged: (value, init = false) =>
          this.parentChanged(schema, value, init),
        schema,
        fields: this.fields,
        form: this.form,
        filters: this.filters,
        getProp: this.getProp(schema),
        getFromSchema: this.getFromSchema(schema),
        value: this.form[schema.field],
      };
    },

    updateField(schema, value) {
      this.$emit("updateField", { ...schema, value });
    },

    parentChanged(schema, value, init = false) {
      this.updateField(schema, value);

      if (!has(schema, "rel.child.model")) {
        return;
      }

      value = Array.isArray(value) ? value : [value];

      let items = getSafe(this.sharedData, schema.rel.child.model);

      this.filters[schema.rel.child.model] = items.filter((item) => {
        if (item[schema.rel.child.ownKey])
          return value.indexOf(item[schema.rel.child.ownKey].id) > -1;
        return false;
      });

      this.filters = { ...this.filters };
      !init &&
        this.parentChanged(this.findFieldByModel(schema.rel.child.model), null);
    },

    findFieldByModel(model) {
      return this.flatFields.filter((f) => f?.rel?.model == model)[0];
    },

    getComponent(schema) {
      return has(schema, "component")
        ? schema.component
        : this.map[schema.type];
    },

    getProp(field) {
      return (prop, def = null) =>
        getSafe(field, prop === "*" ? "props" : `props.${prop}`, def);
    },

    getFromSchema(field) {
      return (prop, def = null) => getSafe(field, prop, def);
    },
  },

  computed: {
    flatFields() {
      return flatten(this.fields);
    },

    sortedFields() {
      return sortBy(this.fields, "order");
    },
  },
};
</script>
