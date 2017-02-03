// Declare app level module which depends on filters, and services
angular.module('myapp', ['ui.router', 'ui.bootstrap', 'ui.date', 'schemaForm'])
  .config(['$stateProvider', '$urlRouterProvider', 'schemaFormProvider', 'sfPathProvider', function ($stateProvider, $urlRouterProvider, schemaFormProvider, sfPathProvider) {
    $stateProvider
      .state('demo1', {
        url: '/demo1',
        templateUrl: 'views/demo1/home.html',
        controller: 'Demo1Controller'
      })
      .state('demo2', {
        url: '/demo2',
        templateUrl: 'views/demo2/home.html',
        controller: 'Demo2Controller'
      })
      .state('demo3', {
        url: '/demo3',
        templateUrl: 'views/demo3/home.html',
        controller: 'Demo3Controller'
      });
    $urlRouterProvider.otherwise('/demo1');
    // To allow more form types in schema
    var help = function (name, schema, options){
      if (schema.type === 'help') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'help';
        f.helpvalue = schema.helpvalue;
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
      else{
        return null; //Editor acting annoying
      }
    };
    var template = function (name, schema, options){
      if (schema.type === 'template') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'template';
        f.template = schema.template;
        f.templateUrl = schema.templateUrl;
        f.properties = schema.properties;
        // angular.forEach(schema, function(v,k){
        //     f[k] = v;
        // });
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        // alert(JSON.stringify(options));
        return f;
      }
      else{
        return null; //Editor acting annoying
      }
    };
    var textarea = function (name, schema, options){
      if (schema.type === 'string' && schema.multiline === true) {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'textarea';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
      else{
        return null; //Editor acting annoying
      }
    };
    var submit = function (name, schema, options){
      if (schema.type === 'submit') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'submit';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
      else{
        return null; //Editor acting annoying
      }
    };
    schemaFormProvider.defaults.help = [help];
    schemaFormProvider.defaults.template = [template];
    schemaFormProvider.defaults.submit = [submit];
    schemaFormProvider.defaults.string.unshift(textarea);
  }]);
