const del = require("del");
const gulp = require("gulp");
const browser_sync = require("browser-sync").create();
const nunjucks = require("gulp-nunjucks");
const inject = require("gulp-inject-string");
const beautify = require("gulp-beautify");
const merge_stream = require("merge-stream");
const sass = require("gulp-sass")(require("sass"));
const autoPrefixer = require("gulp-autoprefixer");
const nodemon = require('gulp-nodemon');

const pkg = require("./package.json");
const dependencies = require("./dependencies.json");

/*
 * Set name of the main file where app start.
 */
const main_file = 'app.js';

/*
 * Set name of Front End folder.
 * This directory is where all views and public files are.
 */
const front = 'front/';

/*
 * set name of Back End folder.
 * This directory is where all apis, routes and oter server files are.
 */
const back = 'back/';

/*
 * Set the destination/production directory.
 * This directory is where the project is copiled for production.
 * Theis directory is created by gulp
 */
const copiled_dir = "./dist/";

/*
 * Set the source code directory.
 * This directory is where the project is developed.
 */
const src_dir = "./src/";

/*
 * Set the resource directory.
 * This directory is where all the resources of the site
 * are stored.
 */
const resource_dir = "assets/";

/*
 * Website credits
 */
const credits = [
    "* Website Name: " + pkg.name + " -v " + pkg.version,
    "* Author: " + pkg.author,
    "* License: " + pkg.license
];

/*
 * Clean
 *
 * Clean the copiled directory 
 *
 * Note: This is normaly used before running any task.
 */
function clean() {
    return del(copiled_dir + "**/*");
}

/*
 * Copy Files
 *
 * This is a gulp task that copy all static files from
 * source code folder to copiled directory.
 */
function copy_files() {
    const resource_folder = gulp.src([src_dir + front + resource_dir + "**/*"])
        .pipe(gulp.dest(copiled_dir + front + resource_dir))
        .pipe(browser_sync.stream());

    return merge_stream(resource_folder)
}

/*
 * Copile HTML
 *
 * This is a gulp tastk that add or inject all dependencies 
 *  and credits to the html files.
 *  It also copile and unifies the parts of the files.
 */
function copile_HTML() {
    var css_links = "";
    var js_links = "";
    for (let dependency in dependencies) {
        if (dependencies[dependency].css_link !== undefined) {
            for(let l of dependencies[dependency].css_link){
                css_links +=`<link href="/${resource_dir+l}" rel="stylesheet">\n`;
            }
        }
        if (dependencies[dependency].js_link !== undefined) {
            for(let l of dependencies[dependency].js_link){
                js_links +=`<script src="/${resource_dir+l}"></script>\n`;
            }
        }
    }

    var credits_in_html_comentary = `
    <!--
    \t=======================================================================
    \t\t\t${credits.join("\r\n\t\t\t\t")}
    \t=======================================================================
    -->
    `

    return gulp.src([`${src_dir + front}**/*.html`, `!${src_dir + front}**/*template.html`, `!${src_dir + front}**/parts/**`])
        .pipe(nunjucks.compile())
        .pipe(inject.after("<!-- Vendor CSS Files -->", css_links))
        .pipe(inject.after("<!-- Vendor JS Files -->", js_links))
        .pipe(beautify.html({ indent_size: 2, max_preserve_newlines: 1 }))
        .pipe(inject.before("</head>", credits_in_html_comentary))
        .pipe(gulp.dest(copiled_dir + front))
        .pipe(browser_sync.stream());
}

/*
 * Copy Dependencies
 *
 * This is a gulp task that copy the Depencencies, from his
 * source file to the copiled directory.
 */
function copy_dependencies() {
    var stream = merge_stream();

    for (let dependency in dependencies) {
        if (dependencies[dependency].src) {
            stream.add(
                gulp.src(dependencies[dependency].src)
                .pipe(gulp.dest(
                    copiled_dir + 
                    front +
                    resource_dir + 
                    dependencies[dependency].dest
                ))
            );
        }
    }

    return stream;
}

/*
 * Copile SCSS
 *
 * This funciton transform scss files to a
 * css file, add credits and reload browser.
 */
function copile_scss() {
    return gulp.src(`./${src_dir + front}scss/**/*.scss`)
        .pipe(sass({
            outputStyle: "expanded"
        })
        .on("error", sass.logError))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(inject.prepend(`/*\n${credits.join("\n")}\n*/\n\n`))
        .pipe(gulp.dest(`${copiled_dir + front + resource_dir}css`))
        .pipe(browser_sync.stream());
}

/*
 * Copile Front JS
 *
 * This function add credits to js, use beautify
 * and reload browser
 */
function copile_front_js() {
    return gulp.src(`./${src_dir + front}js/**/*.js`)
        .pipe(beautify.js({ indent_size: 2, max_preserve_newlines: 2 }))
        .pipe(inject.prepend(`/*\n${credits.join("\n")}\n*/\n\n`))
        .pipe(gulp.dest(`${copiled_dir + front + resource_dir}js`))
        .pipe(browser_sync.stream());
}

/*
 * Copile Back JS
 *
 * This function add credits to js, use beautify
 */
function copile_back_js() {
    return gulp.src([`${src_dir}**/*.js`, `!${src_dir + front}**/*.js`])
        .pipe(beautify.js({ indent_size: 2, max_preserve_newlines: 2 }))
        .pipe(inject.prepend(`/*\n${credits.join("\n")}\n*/\n\n`))
        .pipe(gulp.dest(`${copiled_dir}`));
}

/*
 * Init nodemon and live server browser sync
 *
 * Start the server with nodemon
 * Start the browser to see changes
 */
function init_nodemon(cb) {
    var started = false;
    return nodemon({
        script: copiled_dir + main_file
    }).on('start', function () {
        //to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true; 
            browser_sync.init(null, {
            proxy: "http://localhost:3000/",
            files: [`${copiled_dir + front}`],
            port: 7000,
            });
        } 
    });
}

/*
 * Watch Files
 *
 * This is a gulp task that watch for changes on developed
 * files.
 */
function watch_files() {
    gulp.watch(`${src_dir + front}**/*.html`, copile_HTML)
    gulp.watch(`${src_dir + front + resource_dir}**/*`, copy_files)
    gulp.watch(`${src_dir + front}scss/**/*`, copile_scss)
    gulp.watch(`${src_dir + front}js/**/*`, copile_front_js)
    gulp.watch([`${src_dir}**/*.js`, `!${src_dir + front}**/*.js`], copile_back_js)
}


/*
 * Set the Tasck to create a all the copiled directory.
 */
const create_copiled_dir = gulp.series(clean, 
    gulp.parallel(copy_files, copile_HTML, copile_scss, copile_front_js, copile_back_js, copy_dependencies));


//Export tasks
exports.watch = gulp.series(create_copiled_dir, watch_files);
exports.start = gulp.series(create_copiled_dir, gulp.parallel(watch_files, init_nodemon));
exports.default = create_copiled_dir;
