angular.module('myapp')
  .controller('Demo2Controller', ['$scope', '$http', function ($scope, $http) {
    $scope.schema = {
      type: "object",
      properties: {
        comment: {
          type: 'template',
          template: '<p>{{form.author}}: {{form.comment}}</p>',
          author: '',
          comment: ''
        },
        form2: {
          type: 'array',
          items: {
            type: 'object',
            properties:{
              author: {type: 'string', title: 'Name'},
              comment: {type: 'string', multiline: true, title: 'Comment'},
              submit: {type: 'submit', title: 'Comment'}
            }
          }
        }}
    };
    $scope.form = [
      // {key: 'comment', author: 'lol', comment:'grah'}
    ];
    $scope.model = {};

    $scope.initialize = function() {
      $http.get('/init2')
        .then(function(resp){
          $scope.form = resp.data;
          $scope.$broadcast('schemaFormRedraw');
        }, function(resp){
          alert(JSON.stringify(resp));
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
