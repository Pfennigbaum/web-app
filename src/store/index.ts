import Vue from "vue";
import Vuex from "vuex";
import { Download } from "../helper/download";
import { colors } from "quasar";
import { Customer, CoreCustomer } from "../helper/coreTypes";
import { createDirectStore } from "direct-vuex";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const { setBrand } = colors;

Vue.use(Vuex);

export interface StoreState {
    customers: CoreCustomer[];
    selectedCustomer: Customer | null;
    isLoadingCustomer: boolean;
    isLoadingCustomerList: boolean;
}

const { store, rootActionContext, moduleActionContext } = createDirectStore({
    state: {
        // customers: sampleData,
        // selectedCustomerId: "",
        customers: [],
        selectedCustomer: null,
        isLoadingCustomer: false,
        isLoadingCustomerList: false
    } as StoreState,
    getters,
    mutations,
    actions,

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV === "true"
});

export function generateId() {
    return Math.random()
        .toString(36)
        .substring(2, 10);
}

setBrand("classification", "#f44336");
setBrand("outcome", "#009688");
setBrand("intervention", "#ff6f00");

// @ts-ignore
window.download = () => {
    Download.ts(store.state.customers, "sample1.ts");
};

// Export the original Vuex store because of quasar
export default store.original;

// the typesafe, direct store
export { store };

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext };

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store;
declare module "vuex" {
    interface Store<S> {
        direct: AppStore;
    }
}
