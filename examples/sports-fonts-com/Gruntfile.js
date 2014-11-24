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
                    '{,*/}*.html'
                ]
            },{
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/fonts',
                dest: '<%= config.dist %>/fonts/',
                src: '{,*/}*.{ttf,eot,svg,woff}'
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

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
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
