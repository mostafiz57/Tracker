module.exports = function(grunt) {

	grunt.initConfig({
		distdir: 'dist',
		pkg: grunt.file.readJSON("package.json"),
		build_config: {
			vendor_files: {
				js: [
		      'libs/angular/angular.js',
		      'libs/angular-resource/angular-resource.js',
		      'libs/angular-cookies/angular-cookies.js',
		      'libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
		      'libs/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
		      'libs/angular-ui-router/release/angular-ui-router.js',
		      'libs/googlemap/*',
		      'libs/lodash/dist/lodash.underscore.js',
		      'libs/angular-google-maps/dist/angular-google-maps.js',
					'libs/markerwithlabel/index.js',
					'libs/moment/moment.js',
					'libs/bootstrap-daterangepicker/daterangepicker.js',
					'libs/jquery/dist/jquery.js',
					'libs/d3/d3.js'
		    ],
		    css: [
		    	'libs/bootstrap/dist/css/bootstrap.css',
		    	'libs/font-awesome/css/font-awesome.css',
		    	'libs/bootstrap-daterangepicker/daterangepicker-bs3.css',
		    ],
				fonts: ['libs/font-awesome/fonts/*', 'libs/bootstrap/fonts/*'],
		    assets: [
		    ]
			}
		},

		src:{
			js: ['src/**/*.js'],
			tpl: {
				app: ['src/app/**/*.tpl.html'],
				common: ['src/common/**/*.tpl.html']
			},
			specs: ['tests/**/*.spec.js'],
			sass: 'src/sass/*.sass'
		},

		clean: ['<%= distdir %>/*'],

		copy:{
			assets: {
				files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
			},
			templates:{
				files:[{
					dest:'<%= distdir %>/templates',
					src: '*.tpl.html',
					expand: true,
					cwd: 'src/templates'
				}]
			},
			build_vendorjs: {
        files: [
          {
            src: [ '<%= build_config.vendor_files.js %>' ],
            dest: '<%= distdir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendor_css: {
        files: [
          {
            src: [ '<%= build_config.vendor_files.css %>' ],
            dest: '<%= distdir %>/css/',
            cwd: '.',
            expand: true,
            flatten: true
          }
       ]
      },
   		build_fonts:{
   			files: [{
					src: [ '<%= build_config.vendor_files.fonts %>' ],
					dest: '<%= distdir %>/fonts',
					cwd: '.',
					expand: true,
					flatten: true
				}]
   		}
		},

		html2js:{
			app: {
				options: {
					base: 'src/app'
				},
				src: ['<%= src.tpl.app %>'],
				dest: '<%= distdir %>/js/templates-app.js'
			},
			common: {
				options: {
					base: 'src/common'
				},
				src: ['<%= src.tpl.common %>'],
				dest: '<%= distdir %>/js/templates-common.js'
			}
		},

		concat:{
			dist:{
				src: ['<%= src.js%>'],
				dest: '<%= distdir %>/js/<%= pkg.name %>.js'
			}
		},

		sass: {
			build:{
				files: [{
					expand: true,
					cwd: 'src/sass',
					src: ['*.sass'],
					dest: '<%= distdir%>/css',
					ext: '.css'
				}]
			}
		},

		jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.specs %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    },

    watch:{
    	all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.sass %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>'],
        tasks:['default','timestamp'],
				options: {
					livereload: true
				}
      },
    }
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-html2js');

	grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  grunt.registerTask('build', ['clean', 'copy', 'concat', 'html2js', 'sass:build']);
  grunt.registerTask('default', [ 'build']);
};
