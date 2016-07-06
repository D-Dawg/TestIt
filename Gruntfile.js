(function() {
    'use strict';
    module.exports = grunt => {
        grunt.initConfig({
            jshint: {
                options: {
                    jshintrc: true
                },
                all: ['src/js/**/*.js', 'app/**/*.js', 'Gruntfile.js', 'install.js']
            },
            cssmin: {
                dist: {
                    files: {
                        'www/assets/testit.min.css': ['src/out/testit.css']
                    }
                }
            },
            sass: {
                dist: {
                    files: {
                        'src/out/testit.css': 'src/scss/main.scss'
                    }
                }
            },
            concat: {
                deps: {
                    src: [
                        'src/bower/jquery/dist/jquery.min.js',
                        'src/bower/Materialize/dist/js/materialize.min.js'
                    ],
                    dest: 'www/assets/testit-dependencies.min.js'
                },
                'login-deps': {
                    src: [
                        'src/bower/jquery/dist/jquery.min.js',
                        'src/bower/Materialize/dist/js/materialize.min.js',
                        'src/bower/angular/angular.min.js'
                    ],
                    dest: 'www/assets/testit-login-dependencies.min.js'
                }
            },
            copy: {
                assets: {
                    files: [
                        {expand: true, src: ['roboto/*'], cwd: 'src/bower/Materialize/fonts/', dest: 'www/assets/'}
                    ]
                }
            }
        });
        grunt.registerTask('test', ['jshint:all']);
        grunt.registerTask('compile-css', ['sass:dist', 'cssmin:dist']);
        grunt.registerTask('concat-deps', ['concat:deps', 'concat:login-deps']);
        grunt.registerTask('release', ['copy:assets', 'compile-css', 'concat-deps']);

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-copy');

    };
})();
