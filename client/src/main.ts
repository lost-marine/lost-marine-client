import App from "./App.vue";
import { createApp, type Component, type ComputedOptions, type MethodOptions } from "vue";
import VueVirtualScroller from "vue-virtual-scroller";

const TypedAssertedApp = App as Component<any, any, any, ComputedOptions, MethodOptions, any, any>;
createApp(TypedAssertedApp).use(VueVirtualScroller).mount("#app");
