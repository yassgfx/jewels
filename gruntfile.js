/*jshint node:true, es3:false*/
(function() {
    'use strict';
    module.exports = function(grunt) {
        require('load-grunt-tasks')(grunt); // Load grunt tasks automatically
        // Project configuration.
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            banner: '/*! <%= pkg.name %> | version <%= pkg.version %> | license <%= pkg.license %> | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> | <%= pkg.homepage %> */\n',
            // Task configuration.
            clean: {
                dist: ['dist'],
                tmp: ['tmp']
            },
            copy: {
                tmp: {
                    files: [
                        { expand: true, cwd: 'src', src: ['*.*'], dest: 'tmp/' }
                    ]
                },
                dist: {
                    files: [
                        { expand: true, cwd: 'src', src: ['**/*.scss', '!jewels.scss'], dest: 'dist/sass/', }
                    ]
                }
            },
            concat: {
                options: {
                    banner: '<%= banner %>',
                    stripBanners: true
                },
                tmp: {
                    files: {
                        'tmp/jewels.js': ['tmp/**/*.js'],
                        'tmp/jewels.css': ['tmp/**/*.css']
                    }
                }
            },
            replace: {
                options: {
                    patterns: [{
                        match: /'url:(.*?)'/g,
                        replacement: function(match, path) {
                            return '\'' + grunt.file.read(path.replace('src', 'tmp')).split('\'').join('\\\'') + '\'';
                        }
                    }]
                },
                tmp: {
                    files: [
                        { expand: true, src: 'tmp/**/*.js', dest: './' }
                    ]
                }
            },
            uglify: {
                options: {
                    banner: '<%= banner %>'
                },
                tmp: {
                    src: 'tmp/jewels.js',
                    dest: 'tmp/jewels.min.js'
                }
            },
            cssmin: {
                tmp: {
                    src: 'tmp/jewels.css',
                    dest: 'tmp/jewels.min.css'
                }
            },
            htmlmin: {
                options: {
                    removeComments: false,
                    collapseWhitespace: true
                },
                tmp: {
                    files: [
                        { expand: true, src: 'tmp/**/*.html', dest: './' }
                    ]
                }
            },
            sass: {
                options: {
                    outputStyle: 'expanded'
                },
                tmp: {
                    files: {
                        'tmp/jewels.css': 'src/jewels.scss'
                    }
                }
            },
            autoprefixer: {
                options: {
                    browsers: ['last 2 versions', 'ie >= 11']
                },
                tmp: {
                    src: 'tmp/jewels.css'
                }
            },
            version: {
                default: {
                    src: ['package.json']
                }
            },
            jshint: {
                all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
            },
            sasslint: {
                options: {
                    configFile: '.sass-lint.yml'
                },
                html: {
                    src: ['src/**/*.scss'],
                    options: {
                        outputFile: 'sass-lint.html',
                        formatter: 'html'
                    }
                },
                console: {
                    src: ['src/**/*.scss']
                }
            },
            watch: {
                options: {
                    spawn: true
                },
                lab: {
                    files: ['src/**', 'lab/**'],
                    tasks: ['clean', 'copy:tmp', 'sass', 'autoprefixer']
                }
            },
            cssmin: {
                dist: {
                    src: 'dist/jewels.css',
                    dest: 'dist/jewels.min.css'
                }
            },
            express: {
                lab: {
                    options: {
                        background: true,
                        script: 'app/server.js'
                    }
                }
            },
            gitadd: {
                dist: {
                    files: {
                        src: ['package.json', 'dist/**/*']
                    }
                }
            },
            gittag: {
                dist: {
                    options: {
                        tag: '<%= pkg.version %>'
                    }
                }
            },
            gitcommit: {
                dist: {
                    options: {
                        message: 'release'
                    },
                    files: {
                        src: ['package.json', 'dist/**/*']
                    }
                }
            },
            gitpush: {
                dist: {
                    options: {
                        tags: true,
                        branch: 'master'
                    }
                }
            }
        });
        //utils
        grunt.registerTask('readpkg', function() {
            grunt.config.set('pkg', grunt.file.readJSON('package.json'));
        });
        //test
        grunt.registerTask('test', function() {});
        grunt.registerTask('lab', ['clean', 'copy:tmp', 'sass', 'autoprefixer', 'express', 'watch']);
        //build
        grunt.registerTask('build', ['clean', 'jshint', 'sasslint', 'copy:tmp', 'sass', 'autoprefixer', 'htmlmin', 'replace', 'concat', 'uglify', 'cssmin', 'copy:dist', 'clean:tmp']);
        //release
        grunt.registerTask('publish', ['readpkg', 'build', 'gitadd', 'gitcommit', 'gittag', 'gitpush']);
        grunt.registerTask('release', ['release:patch']);
        grunt.registerTask('release:major', ['version::major', 'publish']);
        grunt.registerTask('release:minor', ['version::minor', 'publish']);
        grunt.registerTask('release:patch', ['version::patch', 'publish']);
    };
})();