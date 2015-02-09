module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var config = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    config: config,

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js: {
        files: ['<%= config.app %>/js/{,*/}*.js'],
        // tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/scss/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/scss/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '<%= config.app %>/img/{,*/}*'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    clean: {
        dist: {
            files: [{
                dot: true,
                src: [
                    '.tmp',
                    '<%= config.dist %>/*',
                    '!<%= config.dist %>/.git*'
                ]
            }]
        },
        server: '.tmp'
    },

    useminPrepare: {
        options: {
            dest: '<%= config.dist %>'
        },
        html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        options: {
            assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/img']
        },
        html: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/css/{,*/}*.css']
    },

    rev: {
        dist: {
            files: {
                src: [
                    '<%= config.dist %>/js/{,*/}*.js',
                    '<%= config.dist %>/css/{,*/}*.css',
                    '<%= config.dist %>/img/{,*/}*.*',
                    '<%= config.dist %>/*.{ico,png}'
                ]
            }
        }
    },

    sass: {
        options: {
            loadPath: [
                'bower_components'
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.app %>/scss',
                src: ['*.scss'],
                dest: '.tmp/css',
                ext: '.css'
            }]
        },
        server: {
            files: [{
                expand: true,
                cwd: '<%= config.app %>/scss',
                src: ['*.scss'],
                dest: '.tmp/css',
                ext: '.css'
            }]
        }
    },

    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.app %>/img',
                src: '{,*/}*.{gif,jpeg,jpg,png}',
                dest: '<%= config.dist %>/img'
            }]
        }
    },

    svgmin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.app %>/img',
                src: '{,*/}*.svg',
                dest: '<%= config.dist %>/img'
            }]
        }
    },

    autoprefixer: {
        options: {
            browsers: ['last 1 version']
        },
        dist: {
            files: [{
                expand: true,
                cwd: '.tmp/css/',
                src: '{,*/}*.css',
                dest: '.tmp/css/'
            }]
        }
    },

    htmlmin: {
        dist: {
            options: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            },
            files: [{
                expand: true,
                cwd: '<%= config.dist %>',
                src: '{,*/}*.html',
                dest: '<%= config.dist %>'
            }]
        }
    },

    copy: {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '*.{ico,png,txt}',
                    '.htaccess',
                    'images/{,*/}*.webp',
                    '{,*/}*.html'
                ]
            }]
        },
        styles: {
            expand: true,
            dot: true,
            cwd: '<%= config.app %>/scss',
            dest: '.tmp/css/',
            src: '{,*/}*.css'
        }
    },

    concurrent: {
        server: [
            'sass:server',
            'copy:styles'
        ],
        test: [
            'copy:styles'
        ],
        dist: [
            'sass',
            'copy:styles',
            'imagemin',
            'svgmin'
        ]
    }
  });

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', ['build']);

};
