import PropTypes from "prop-types";
import {
  Children,
  isValidElement,
  useMemo,
  memo,
  forwardRef,
  useImperativeHandle
} from "react";
import FormContext from "./FormContext";

// form表单容器
// 自身不参与更新
// 接受store, 通过context将store传递下去
// 检查children componentType，过滤显示children

const Form = memo(
  forwardRef(({ store, onSubmit, children }, ref) => {
    useImperativeHandle(ref, () => {
      return {
        getValues: store.getValues,
        validateValues: store.validateValues,
        reset: store.reset,
        setInitValues: store.setInitValues
      };
    });
    // 数据submit
    // 提交数据之前判断store.errors
    // 为{}, 则验证所有数据
    const handleSubmit = () => {
      if (Object.values(store.errors).some((val) => !!val)) {
        return;
      }
      // 数据验证
      store.validateValues();
      if (Object.values(store.errors).some((val) => !!val)) {
        // 更新渲染
        store.notify("*");
        return;
      } else if (onSubmit) onSubmit(store.getValues());
    };

    const validateChildren = useMemo(() => {
      const lists = [];
      Children.forEach(children, (childVal) => {
        if (
          isValidElement(childVal) &&
          (childVal.type.componentType === "formField" ||
            childVal.type === "button")
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
          values: store.values,
          setValues: store.setValues,
          errors: store.errors
        }}
      >
        <form onSubmit={handleSubmit}>{validateChildren}</form>
      </FormContext.Provider>
    );
  })
);

Form.propTypes = {
  children: PropTypes.node
};

export default Form;
