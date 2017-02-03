angular.module('myapp')
  .controller('Demo1Controller', ['$scope', '$http', function ($scope, $http) {
      $scope.schema = {
          type: "object",
          properties: {
              page: {type: 'help', helpvalue: 'Hello World'},
              form1: {
                  type: 'array',
                  items: {
                      type: 'object',
                      properties:{
                          stuff: {type: 'string', title: 'Test', description: 'lol'}
                      }
                  }
              }}
      };
      $scope.form = [];
      $scope.model = {};

      $scope.initialize = function() {
          $http.get('/init1')
              .then(function(resp){
                  $scope.form = resp.data;
                  $scope.$broadcast('schemaFormRedraw');
              });
      };
      $scope.onSubmit = function(form) {
          $scope.$broadcast('schemaFormValidate');
          if(form.$valid){
              // The array construction listifies values, so we undo that
              var model = {};
              for(var prop in $scope.model){
                  if(angular.isArray($scope.model[prop])){
                      model[prop] = $scope.model[prop][0];
                  }
                  else{
                      model[prop] = $scope.model[prop];
                  }
              }
              alert(JSON.stringify(model));
              $http.post('/formUp', model)
                  .then(function(resp){
                      if(resp.data){
                          $scope.form = resp.data;
                          $scope.$broadcast('schemaFormRedraw');
                      }
                  }, function(resp){
                      $scope.form = resp;
                  });
          }
      };
  }]);
