/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      js:{
          cwd: 'assets/js/',
          files: ['*.js', '!*.min.js'],
          tasks: ['concat', 'uglify'],
      },
      css: {
          files: 'assets/css/*.less',
          tasks: ['less'],
          options: {
              livereload: true
          }
      }
    },
      autoprefixer: {
          development: {
              browsers: ['last 2 version', 'ie 9'],
              expand: true,
              flatten: true,
              src: 'assets/css/*.css',
              dest: 'assets/css'
          }
      },
      less: {
        development: {
          options: {
            paths: ['assets/css']
          },
          files: {
            'assets/css/style.css': 'assets/css/style.less'
          },
          plugins: [
              new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions", 'ie9']})
          ]
        },
        production: {
          options: {
            paths: ['assets/css']
          },
          files: {
            'assets/css/style.css': 'assets/css/style.less'
          }
        }
      },

      
        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: 'assets/css/',
              src: ['*.css', '!*.min.css'],
              dest: 'assets/css',
              ext: '.min.css'
            }]
          }
        }
      
    
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-less');
  // grunt.loadNpmTasks('less-plugin-clean-css');
  // grunt.loadNpmTasks('less-plugin-autoprefix');
    
  grunt.loadNpmTasks('grunt-contrib-cssmin');
    
  

  grunt.registerTask( 'default', [ 'less', 'cssmin', 'concat', 'uglify' ] );
  grunt.registerTask( 'prod', [ 'concat', 'uglify' ] );

};
