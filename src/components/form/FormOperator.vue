<template>
  <div class="flex flex-wrap">
    <component
      v-for="(schema, key) in filteredFields"
      :is="Array.isArray(fields) ? 'FieldSet' : 'div'"
      class="d-flex flex-wrap"
      :label="key"
      :key="key"
    >
      <div
        v-for="(property, index) in Array.isArray(schema) ? schema : [schema]"
        class="my-0 p-1 w-full"
        :key="property.field"
        v-bind="getSafe(property, 'class', {})"
      >
        <component
          :index="index"
          v-bind="bind(property)"
          :is="getComponent(property)"
          @mounted="mounted(property.field)"
        />
      </div>
    </component>
  </div>
</template>

<script setup>
import useMajra from "../../composables/useMajra";
import { ref, defineProps, defineEmits, computed, inject } from "vue";
import { event, listen } from "./../../composables/useEmitter";
import {
  sortBy,
  has,
  pickBy,
  isString,
  isEmpty,
  flatten,
  get as getSafe,
} from "lodash";
// eslint-disable-next-line no-unused-vars
const FieldSet = async () => import("./../utilities/FieldSet");

const props = defineProps({
  fields: {},
  form: {},
  index: {},
});

const emit = defineEmits(["updateField"]);

let filters = ref({});
let sharedData = ref({});

const flatFields = computed(() => flatten(props.fields));
const sortedFields = computed(() => sortBy(props.fields, "order"));
const filteredFields = computed(() =>
  sortedFields.value.filter((schema) =>
    has(schema, "if") ? schema.if(props.form) : true
  )
);

const errors = ref({});

function mounted(field) {
  event("mounted." + field, {
    item: props.form,
    field: field,
  });
}

// eslint-disable-next-line no-unused-vars
function created() {
  listen("resetFilters", () => {
    filters.value = {};
  });
}

function bind(schema) {
  return {
    schema,
    form: props.form,
    fields: props.fields,
    filters: filters.value,
    getProp: getProp(schema),
    getFromSchema: getFromSchema(schema),
    value: getSafe(props.form, schema.field),
    error: getSafe(errors.value, schema.field, false),
    updateField: (value) => updateField(schema, value),
    parentChanged: (value, init = false) => parentChanged(schema, value, init),
  };
}

function validate() {
  for (const schema of props.fields) {
    validation(schema, getSafe(props.form, schema.field));
  }
}

const formName = inject("form.name");

listen("validate." + formName, (result) => {
  validate();
  result.value.errors = pickBy(errors.value, (val) => !!val);
  result.value.isValid = isEmpty(result.value.errors);
});

function validation(schema, value) {
  if (!has(schema, "validation")) return;

  const isValid = schema.validation(value);

  errors.value[schema.field] = isValid !== true ? isValid : false;
}

function updateField(schema, value) {
  validation(schema, value);

  emit("updateField", { ...schema, value });
}

function parentChanged(schema, value, init = false) {
  updateField(schema, value);

  if (!has(schema, "rel.child.model")) {
    return;
  }

  value = Array.isArray(value) ? value : [value];

  let items = getSafe(sharedData.value, schema.rel.child.model);

  filters.value[schema.rel.child.model] = items.filter((item) => {
    if (item[schema.rel.child.ownKey])
      return value.indexOf(item[schema.rel.child.ownKey].id) > -1;
    return false;
  });

  filters.value = { ...filters.value };
  !init && parentChanged(findFieldByModel(schema.rel.child.model), null);
}

function findFieldByModel(model) {
  return flatFields.value.filter((f) => f?.rel?.model == model)[0];
}

const { registeredFields } = useMajra();

function getComponent(schema) {
  return has(schema, "component") && isString(schema.component)
    ? registeredFields[schema.component]
    : schema.component;
}

function getProp(field) {
  return (prop, def = null) =>
    getSafe(field, prop === "*" ? "props" : `props.${prop}`, def);
}

function getFromSchema(field) {
  return (prop, def = null) => getSafe(field, prop, def);
}
</script>
