<template>
  <Modal
    v-model:visible="visible"
    :title="title"
    :width="width"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <Spin :spinning="loading">
      <Form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
        preserve="false"
        :model="modelRef"
      >
        <!-- labelAlign="left" -->
        <FormItem label="用户名" v-bind="validateInfos.userName">
          <Input v-model:value="modelRef.userName">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </Input>
        </FormItem>
        <FormItem label="新密码" v-bind="validateInfos.password">
          <Password v-model:value="modelRef.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </Password>
        </FormItem>
        <FormItem label="确认新密码" v-bind="validateInfos.passwordTwo">
          <Password v-model:value="modelRef.passwordTwo">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </Password>
        </FormItem>
      </Form>
    </Spin>
  </Modal>
</template>
<script setup>
import { Modal, Button, Form, Spin, Input, Select } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { ref, getCurrentInstance, defineComponent, reactive, toRaw } from "vue";
import { updateUser } from "@/api/login";

const FormItem = Form.Item;
const { Option } = Select;
const { Password } = Input;
const useForm = Form.useForm;

const { emit, proxy } = getCurrentInstance();

const width = "500px";
const title = "账户修改";
const visible = ref(false);
const currentRecord = ref({});
const labelCol = { span: 6 };
const wrapperCol = { span: 16 };
const loading = ref(false);

const modelRef = reactive({
  userName: "admin",
  password: "123456",
  passwordTwo: "123456",
});
const rulesRef = reactive({
  userName: [
    {
      required: true,
      message: "请输入新的用户名",
    },
    {
      validator: (rule, value) => {
        if (value != "") {
          if (value === "admin") {
            return Promise.reject("用户名已经存在");
          } else {
            return Promise.resolve();
          }
        } else {
          return Promise.resolve();
        }
      },
      trigger: ["change", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入新的密码",
    },
  ],
  passwordTwo: [
    {
      required: true,
      message: "请再次输入新的密码",
    },
    {
      validator: (rule, value) => {
        if (value !== modelRef.password) {
          return Promise.reject("两次输入的密码不一致");
        } else {
          return Promise.resolve();
        }
      },
      trigger: ["change", "blur"],
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = (record = {}) => {
  resetFields();
  currentRecord.value = record;
  visible.value = true;
};
const handleOk = () => {
  validate()
    .then(() => {
      loading.value = true;
      const data = toRaw(modelRef);
      const formData = Object.assign(
        {},
        { id: currentRecord.value.id, userType: currentRecord.value.userType },
        data
      );
      updateUser(formData)
        .then((res) => {
          if (res.code === 200) {
            emit("ok");
            proxy.$message.success("修改成功");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          close();
        });
    })
    .catch((err) => {
      console.log("error", err);
    });
};
const handleCancel = () => {
  close();
};
const close = () => {
  visible.value = false;
  loading.value = false;
};
defineExpose({
  handleOk,
  handleCancel,
  open,
});
</script>
<style lang=""></style>
