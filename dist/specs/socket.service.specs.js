describe('Unit testing for socket,', function () {
    var mock, socketService;
    var $q, $timeout, $rootScope;
    var socketResponse, connectError;
    beforeEach(module('socketio'));

    //    beforeEach(inject(function(_$rootScope_, _$q_, _$timeout_) {
    //         $rootScope = _$rootScope_;
    //         $q = _$q_;
    //         $timeout = _$timeout_;
    //     }));

    beforeEach(function () {
        //mock = { alert: jasmine.createSpy() };

        var socket = {
            emit: function (event, operation, data, callback) {
                //console.log("emiting");
                callback(socketResponse);
            }
        }

        connectError = null;
        var mockAuthService = {
            connect: function () {
                var deferred = $q.defer();
                if (connectError) {
                    deferred.reject(connectError);
                }
                else {
                    deferred.resolve(socket);
                }
                return deferred.promise;
            }
        };

        module(function ($provide) {
            // $provide.value('$window', mock);
            $provide.value('authService', mockAuthService);
        });



        inject(function ($injector, _$rootScope_, _$q_, _$timeout_) {
            socketService = $injector.get('socketService');
            $rootScope = _$rootScope_;
            $q = _$q_;
            $timeout = _$timeout_;

        });
    });
    describe('Fetch', function () {

        it('should return the data ', function (done) {
            var someData = 'precious data';
            socketResponse = { data: someData };
            socketService.fetch('test', {}).then(function (data) {
                expect(data).toEqual(someData);
                done();
            });
            $rootScope.$apply();
        });

        it('should catch and return an error received from the backend', function (done) {
            var someErrCode = 'BACKEND_ERR';
            var someErrDescription = 'Something happened';
            socketResponse = { code: someErrCode, data: someErrDescription };
            socketService.fetch('test', {}).catch(function (err) {
                expect(err.code).toEqual(someErrCode);
                expect(err.description).toEqual(someErrDescription);
                done();
            });
            $rootScope.$apply();
        });

        it('should catch the connection error ', function (done) {
            connectError = true;
            socketService.fetch('test', {}).catch(function (err) {
                expect(err.code).toEqual('CONNECTION_ERR');
                done();
            });
            $rootScope.$apply();

        });
    });
});