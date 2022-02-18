import "./styles.css";
import Form from "./Form";
import FormStore from "./FormStore";
import FormFiled from "./FormField";

export default function App() {
  const store = new FormStore(
    {
      name: "张三",
      age: 28
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

  const handleSubmit = (data) => {
    console.log("formData", data);
  };
  return (
    <div className="App">
      <Form onSubmit={handleSubmit} store={store}>
        <FormFiled name="name" label="名称: ">
          <input placeholder="其功能输入" />
        </FormFiled>
        <FormFiled name="age" label="年龄: ">
          <input placeholder="输入2" />
        </FormFiled>
        <button>保存</button>
      </Form>
    </div>
  );
}
