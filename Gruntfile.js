// Copyright © 2016 RTE Réseau de transport d’électricité

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          "dist/leaflet.d3chart.js": ["src/d3chart.js"]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                'Copyright © 2016 RTE Réseau de transport d’électricité */\n'
      },
      build: {
        src: 'dist/leaflet.d3chart.js',
        dest: 'dist/leaflet.d3chart.min.js'
      }
    },
    watch: {
      scripts: {
        files: ["src/*"],
        tasks: ['browserify', 'uglify']
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'uglify']);

};
