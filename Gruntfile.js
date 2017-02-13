// Copyright © 2016 RTE Réseau de transport d’électricité

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        browserifyOptions : {
          debug: true
        }
      },
      dist: {
        files: {
          "dist/leaflet.minichart.js": ["src/minichart.js"]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                'Copyright © 2016 RTE Réseau de transport d’électricité */\n'
      },
      build: {
        src: 'dist/leaflet.minichart.js',
        dest: 'dist/leaflet.minichart.min.js'
      }
    },
    jsdoc: {
        dist: {
            src: ['src/*.js'],
            options: {
                destination: 'docs',
                template: "template",
                tutorials: "examples",
                readme: "README.md"
            }
        }
    },
    copy: {
      doc: {
        files: [
          {expand: true, src: "img/*", dest: "docs/"},
          {expand: true, cwd: "examples", src: "js/*", dest: "docs/"},
          {expand: true, cwd: "dist", src: "*", dest: "docs/"},
        ]
      }
    },
    watch: {
      source: {
        files: ["src/**/*"],
        tasks: ['browserify', 'uglify']
      },
      doc: {
        files: ["src/*", "README.md", "template/*", "examples/**"],
        tasks: ['jsdoc', "copy:doc"]
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('doc', ['jsdoc', "copy:doc"]);
  grunt.registerTask('default', ['jsdoc', "copy:doc"]);

};
