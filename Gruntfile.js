module.exports = function(grunt) {
    grunt.initConfig({
        nodemon: {
            dev: {
                scripts: './bin/www'
            }
        }
    });
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('default', ['nodemon']);
}