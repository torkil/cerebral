require.config({
  baseUrl: "../",
  shim: {
    "backbone": {
      deps: ["underscore", "cerebral/lib/jquery"],
      exports: "Backbone"
    },
    "underscore": {
      exports: "_"
    },
  },
  paths: {
    "backbone": "cerebral/lib/Backbone",
    "underscore": "cerebral/lib/underscore"
  }
})