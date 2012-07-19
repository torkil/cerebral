require.config({
  baseUrl: "../",
  shim: {
    "backbone": {
      deps: ["underscore", "cerebral/vendor/jquery"],
      exports: "Backbone"
    },
    "underscore": {
      exports: "_"
    },
  },
  paths: {
    "backbone": "cerebral/vendor/Backbone",
    "underscore": "cerebral/vendor/underscore"
  }
})