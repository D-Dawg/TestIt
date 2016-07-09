(function () {
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
                        'bower/jquery/dist/jquery.min.js',
                        'bower/Materialize/dist/js/materialize.min.js',
                        'bower/angular/angular.min.js',
                        'bower/angular-cookies/angular-cookies.min.js',
                        'bower/angular-ui-router/release/angular-ui-router.min.js',
                        'bower/sweetalert2/dist/sweetalert2.min.js',
                        'bower/moment/min/moment-with-locales.min.js'
                    ],
                    dest: 'www/assets/testit-dependencies.min.js'
                },
                dist: {
                    src: ['src/js/app.js', 'src/js/**/*.js'],
                    dest: 'src/out/testit.js'

                }
            },
            copy: {
                assets: {
                    files: [
                        {expand: true, src: ['roboto/*'], cwd: 'bower/Materialize/fonts/', dest: 'www/assets/'},
                        {expand: true, src: ['*'], cwd: 'bower/font-awesome/fonts', dest: 'www/assets/font-awesome'}
                    ]
                }
            },
            uglify: {
                dist: {
                    files: {
                        'www/assets/testit.min.js': ['src/out/testit.js']
                    }
                }
            }
        });
        grunt.registerTask('test', ['jshint:all']);
        grunt.registerTask('compile-css', ['sass:dist', 'cssmin:dist']);
        grunt.registerTask('compile-js', ['concat:dist', 'uglify:dist']);
        grunt.registerTask('release', ['copy:assets', 'compile-css', 'compile-js', 'concat:deps']);

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-uglify');

    };
})();
