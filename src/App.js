import "./styles.css";
import Form from "./Form";
import FormStore from "./FormStore";
import FormFiled from "./FormField";

import { useEffect, useRef } from "react";

export default function App() {
  const formRef = useRef();
  const store = new FormStore(
    {
      name: "张三",
      age: 10
    },
    {
      name: {
        rule: (value) => value.length < 10,
        msg: "名称长度不能超过10"
      },
      age: {
        rule: (value) => value < 100,
        msg: "年龄最大不能超过100"
      }
    }
  );

  const handleSubmit = () => {
    console.log("submit data", formRef.current.getValues());
  };

  const formHandleSubmit = (data) => {
    console.log("data", data);
  };

  useEffect(() => {
    console.log("form instance", formRef.current);
  }, []);
  return (
    <div className="App">
      <Form onSubmit={formHandleSubmit} store={store} ref={formRef}>
        <FormFiled name="name" label="名称: ">
          <input placeholder="其功能输入" />
        </FormFiled>
        <FormFiled name="age" label="年龄: ">
          <input placeholder="输入2" />
        </FormFiled>
      </Form>
      <button onClick={handleSubmit}>保存</button>
    </div>
  );
}
