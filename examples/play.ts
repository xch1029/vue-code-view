import "normalize.css";
import "@examples/styles/base.css";
import "@examples/styles/variables.css";
import "@examples/styles/vt-switch.css";
import "@examples/styles/vt-switch-appearance.css";

import Vue from "vue";
import App from "@examples/views/Play.vue";

import CodeViewer from "@/index";
// import CodeViewer from "vue-code-view";

import Antd from "ant-design-vue";
import ElementUI from "element-ui";

import "ant-design-vue/dist/antd.css";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
// 引入组件 element 2.x
Vue.use(ElementUI);
// 引入组件 antd vue 1.x
Vue.use(Antd);
Vue.use(CodeViewer);

new Vue({
  render: (h) => h(App),
}).$mount("#app");