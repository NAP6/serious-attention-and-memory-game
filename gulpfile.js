const del = require("del");
const gulp = require("gulp");
const browser_sync = require("browser-sync").create();
const nunjucks = require("gulp-nunjucks");
const inject = require("gulp-inject-string");
const beautify = require("gulp-beautify");
const merge_stream = require("merge-stream");
const sass = require("gulp-sass")(require("sass"));
const autoPrefixer = require("gulp-autoprefixer");

const pkg = require("./package.json");
const dependencies = require("./dependencies.json");

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
    const resource_folder = gulp.src([src_dir + resource_dir + "**/*"])
        .pipe(gulp.dest(copiled_dir + resource_dir))
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

    return gulp.src([`${src_dir}**/*.html`, `!${src_dir}**/*template.html`, `!${src_dir}**/parts/**`])
        .pipe(nunjucks.compile())
        .pipe(inject.after("<!-- Vendor CSS Files -->", css_links))
        .pipe(inject.after("<!-- Vendor JS Files -->", js_links))
        .pipe(beautify.html({ indent_size: 2, max_preserve_newlines: 1 }))
        .pipe(inject.before("</head>", credits_in_html_comentary))
        .pipe(gulp.dest(copiled_dir))
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
    return gulp.src(`./${src_dir}scss/**/*.scss`)
        .pipe(sass({
            outputStyle: "expanded"
        })
        .on("error", sass.logError))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(inject.prepend(`/*\n${credits.join("\n")}\n*/\n\n`))
        .pipe(gulp.dest(`${copiled_dir + resource_dir}css`))
        .pipe(browser_sync.stream());
}

/*
 * Copile JS
 *
 * This function add credits to js, use beautify
 * and reload browser
 */
function copile_js() {
    return gulp.src(`./${src_dir}js/**/*.js`)
        .pipe(beautify.js({ indent_size: 2, max_preserve_newlines: 2 }))
        .pipe(inject.prepend(`/*\n${credits.join("\n")}\n*/\n\n`))
        .pipe(gulp.dest(`${copiled_dir + resource_dir}js`))
        .pipe(browser_sync.stream());
}

/*
 * Init live server browser sync
 *
 * Start the browser to see changes
 */
function init_browser_sync(done) {
    browser_sync.init({
        server: {
            baseDir: copiled_dir
        },
        port: 3000,
        notify: false
    });
    done();
}

/*
 * Watch Files
 *
 * This is a gulp task that watch for changes on developed
 * files.
 */
function watch_files() {
    gulp.watch(`${src_dir}**/*.html`, copile_HTML)
    gulp.watch(`${src_dir + resource_dir}**/*`, copy_files)
    gulp.watch(`${src_dir}scss/**/*`, copile_scss)
    gulp.watch(`${src_dir}js/**/*`, copile_js)
}


/*
 * Set the Tasck to create a all the copiled directory.
 */
const create_copiled_dir = gulp.series(clean, 
    gulp.parallel(copy_files, copile_HTML, copile_scss, copile_js, copy_dependencies));


//Export tasks
exports.watch = gulp.series(create_copiled_dir, watch_files);
exports.start = gulp.series(create_copiled_dir, gulp.parallel(watch_files, init_browser_sync));
exports.default = create_copiled_dir;
