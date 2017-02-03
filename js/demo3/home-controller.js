angular.module('myapp')
  .controller('Demo3Controller', ['$scope', '$http', function ($scope, $http) {
    $scope.schema = {
      type: "object",
      properties: {
        page: {
          type: 'help',
          helpvalue: ''
        },
        login:{
          type: 'template',
          templateUrl: 'views/demo3/login.html',
          properties: {
            user: {type: 'string', key: ['user'], schema: {type: 'string'}},
            pass: {type: 'pass', key: ['pass'], schema: {type: 'string'}}
          }
        },
        register:{
          type: 'template',
          templateUrl: 'views/demo3/register.html'
        }
      }
    };
    $scope.form = [];
    $scope.model = {};

    $scope.initialize = function() {
      $http.get('/init3')
        .then(function(resp){
          // alert(JSON.stringify(resp.data));
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
        $scope.model = {};
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
