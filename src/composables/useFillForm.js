// eslint-disable-next-line no-unused-vars
import { get as safeGet, isObject, has } from "lodash";
import { watch } from "vue";
import { event } from "./useEmitter";

export default ({ props, emit }) => {
  let initialForm;

  async function initFormData() {
    let formTmp;
    if (props.formData) {
      formTmp = { ...props.formData };

      for (const schema of props.fields) {
        const formItem = safeGet(formTmp, schema.field);

        if (isObject(schema) && has(schema, "normalize"))
          return (formTmp[schema.field] = schema.normalize(formItem));

        if (formItem && isObject(formItem)) {
          if (!Array.isArray(formItem)) {
            formTmp[schema.field] = schema.objKey
              ? safeGet(formItem, schema.objKey)
              : safeGet(formItem, "id");
          } else if (formItem.length > 0 && isObject(formItem[0])) {
            formTmp[schema.field] = formItem.map((item) => {
              return schema.objKey ? item[schema.objKey] : item.id;
            });
          }
        }
      }
      event("callParentChanged");
    } else {
      formTmp = { ...initialForm };
    }
    event("formFilled", { value: formTmp });
    emit("update:modelValue", { ...formTmp });
  }

  function registerFields(newFields) {
    const initialValue = {};
    const form = newFields.reduce((obj, item) => {
      return {
        ...obj,
        [item["field"]]:
          "default" in item
            ? typeof item.default == "function"
              ? item.default(props.formData)
              : item.default
            : "",
      };
    }, initialValue);
    initialForm = form;
    props.autoGenerate && emit("update:modelValue", { ...form });
  }

  function updateField(schema) {
    const form = { ...props.modelValue };
    const old = form[schema.field];
    form[schema.field] = schema.value;
    event("fieldChanged." + schema.field, {
      old,
      value: schema.value,
    });
    emit("update:modelValue", { ...form });
  }

  watch(
    () => props.fields,
    (newFields) => registerFields(newFields),
    { immediate: true }
  );

  watch(() => props.formData, props.formData && initFormData, {
    immediate: true,
  });

  return { initFormData, registerFields, updateField };
};
