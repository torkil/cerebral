require.config({
  baseUrl: "./",
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
    "backbone": "cerebral/vendor/backbone",
    "underscore": "cerebral/vendor/underscore"
  }
})

console.log('requirejs configurated');