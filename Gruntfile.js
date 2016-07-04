(function() {
    'use strict';
    module.exports = grunt => {
        grunt.initConfig({
            jshint: {
                options: {
                    jshintrc: true
                },
                angular: ['src/js/**/*.js'],
                app: ['app/**/*.js', 'Gruntfile.js', 'install.js']
            }
        });
        grunt.loadNpmTasks('grunt-contrib-jshint');
    };
})();
