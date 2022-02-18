// 为表单props注入value和onchange方法
// context接受Form传递过来的store
// 订阅store，提供state更新的动力
import { cloneElement, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import formContext from "./FormContext";

const FormFiled = ({ children, label, name }) => {
  const [, setUpdate] = useState();
  const { subscribe, setValues, values, errors } = useContext(formContext);
  // 更新数据
  const handleChange = (e) => {
    setValues(name, e.target.value);
  };

  const formItem = cloneElement(children, {
    value: values[name],
    onChange: handleChange
  });

  useEffect(() => {
    const cancelSubscribe = subscribe((key) => {
      if (key === name) {
        setUpdate(values[name]);
      }
    });
    return () => cancelSubscribe();
  }, []);

  return (
    <div>
      <div>
        <span>{label}</span>
        {formItem}
      </div>
      {errors[name] && <div>{errors[name]}</div>}
    </div>
  );
};

FormFiled.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  name: PropTypes.string
};

FormFiled.componentType = "formField";

export default FormFiled;
