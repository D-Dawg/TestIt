(function() {
    'use strict';
    module.exports = grunt => {
        grunt.initConfig({
            jshint: {
                options: {
                    jshintrc: true
                },
                all: ['src/js/**/*.js', 'app/**/*.js', 'Gruntfile.js', 'install.js'],
            }
        });
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.registerTask('test', ['jshint:all']);
    };
})();
