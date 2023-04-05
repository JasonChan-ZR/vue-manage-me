const login = (r) =>
  require.ensure([], () => r(require("@/views/login")), "login");
const manage = (r) =>
  require.ensure([], () => r(require("@/views/manage")), "manage");
const home = (r) =>
  require.ensure([], () => r(require("@/views/home")), "home");

export default [
  { path: "/", component: login },
  {
    path: "/manage",
    component: manage,
    children: [{ path: "", component: home }],
  },
];
