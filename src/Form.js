import PropTypes from "prop-types";
import { Children, isValidElement, useMemo } from "react";
import FormContext from "./FormContext";

// form表单容器
// 自身不参与更新
// 接受store, 通过context将store传递下去
// 检查children componentType，过滤显示children

const Form = ({ store, onSubmit, children }) => {
  // 数据submit
  const handleSubmit = () => {
    if (onSubmit) onSubmit(store.getValues());
  };

  const validateChildren = useMemo(() => {
    const lists = [];
    console.log("validate children");
    console.log("childVal", children);
    Children.forEach(children, (childVal) => {
      if (
        isValidElement(childVal) &&
        childVal.type.componentType === "formField"
      ) {
        lists.push(childVal);
      }
    });
    return lists;
  }, []);

  return (
    <FormContext.Provider
      value={{
        subscribe: store.subscribe,
        // initValues: store.initValues,
        values: store.values,
        setValues: store.setValues,
        errors: store.errors
      }}
    >
      <form onSubmit={handleSubmit}>
        {validateChildren}
        <button>submit</button>
      </form>
    </FormContext.Provider>
  );
};

Form.propTypes = {
  children: PropTypes.node
};

export default Form;
