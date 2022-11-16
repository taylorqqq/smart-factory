<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <h1
        style="
           {
            color: #fff;
            width: 100%;
            font-size: 30px;
            font-weight: 400;
            margin-bottom: 20px;
            text-align: center;
          }
        "
      >
        Smart Login Form
      </h1>
      <Form
        :model="modelRef"
        :rules="validateInfos"
        ref="formRef"
        @keypress.enter="handleLogin"
        :hideRequiredMark="true"
      >
        <FormItem label="用户名" v-bind="validateInfos.userName">
          <Input v-model:value="modelRef.userName">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </Input>
        </FormItem>
        <FormItem label="密&emsp;码" v-bind="validateInfos.password">
          <Password v-model:value="modelRef.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </Password>
        </FormItem>
        <FormItem l>
          <Button
            type="primary"
            class="login-form-button"
            @click="handleLogin"
            :loading="loading"
            style="width: 100%"
          >
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script setup>
import { Form, Input, Row, Col, Button, Divider } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from "vue";
import md5 from "md5";
import { timeFix } from "@/utils/utils";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { useSystemStore } from "@/store/system";
import { FormLabelRequireList } from "@/utils/enterForm";

const { setFormLabelRequireList } = useSystemStore();

const Router = useRouter();
const { userLogin } = useUserStore();

const FormItem = Form.Item;
const { Password } = Input;
const useForm = Form.useForm;

const modelRef = reactive({
  userName: "检测-张三",
  password: "123456",
});

const loading = ref(false);

const { proxy } = getCurrentInstance();

const rulesRef = reactive({
  userName: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const handleLogin = () => {
  let formData = {
    userName: modelRef.userName,
    // password: md5(modelRef.password),
    password: modelRef.password,
    userType: 0,
  };
  validate().then((res) => {
    if (res) {
      userLogin(formData).then((res) => {
        if (res.code == 200) {
          let formLabelRequireList = JSON.parse(
            localStorage.getItem("formLabelRequireList")
          );
          if (!!formLabelRequireList) {
            setFormLabelRequireList(formLabelRequireList);
          } else {
            setFormLabelRequireList(FormLabelRequireList);
          }
          proxy.$notification.success({
            message: "欢迎",
            description: `${timeFix()}，欢迎回来`,
          });
          Router.push("/");
        }
      });
    }
  });
};

onMounted(() => {});
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-wrap {
    width: 400px;
    padding: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 0 10px #e8e8e8;
    // height: 300px;
    height: max-content;
  }
}

.rowGutter {
  // 宽度
  width: 100% !important;
  // 高度
  height: 100% !important;
}
</style>
