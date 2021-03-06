const path = require('path');
const fs = require('fs');
var gulp = require('gulp');
var webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
var gls = require('gulp-live-server');
var browserSync = require('browser-sync').create();

var server = null;

const commonModulejs = {
    rules: [
        //{ test: /\.css$/, loader: 'style!css' },
        //{
            //test: /\.scss$/,
            //loaders: ['style-loader', 'raw-loader', 'sass-loader']
        //},
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        },
        {
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
        },
        {
            test: /\.scss$/,
            loaders: ['style-loader', 'raw-loader', 'sass-loader']
        },

        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                //{{#sass}}
                // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                // the "scss" and "sass" values for the lang attribute to the right configs here.
                // other preprocessors should work out of the box, no loader config like this necessary.
                'scss': [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ],
                'sass': [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader?indentedSyntax'
                ]
                //{{/sass}}
              }
              // other vue-loader options go here
            }
          },
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            include: [
                path.resolve(__dirname, 'src')//,
                //path.resolve(__dirname, 'node_modules/lance-gg'),
                //fs.realpathSync('./node_modules/lance-gg')
            ],
            loader: 'babel-loader',
            query: {
                presets: ['babel-preset-env'].map(require.resolve),
                plugins: ['@babel/plugin-transform-runtime']
            }
        }
    ]
}
/* FRONT-END CONFIG */
var frontWebpackConfig = {
    mode: "development",
    entry: ['babel-polyfill','./src/client/clientEntryPoint.js'],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    //watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    module: commonModulejs
};

const commonModule = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-env'],
                },
            },
        },
    ],
};

/* BACK-END CONFIG */
var backWebpackConfig = {
    mode: "development",
    target : 'node',
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, "./"),
        filename: "backend.js"
    },
    //watch:true,
    watchOptions : {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    plugins: [
        //["transform-runtime", {
            //"regenerator": true,
        //}]//,
        //new webpack.IgnorePlugin(/\.(css|less)$/),
        //new webpack.BannerPlugin('require("source-map-support").install();',
                             //{ raw: true, entryOnly: false }),
        //new StartServerPlugin('server.js'),
        //new webpack.NamedModulesPlugin(),
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoEmitOnErrorsPlugin(),
        //new webpack.DefinePlugin({
            //"process.env": {
                //"BUILD_TARGET": JSON.stringify('server')
            //}
        //}),
    ],
    module : commonModule,
    target: 'node',
    externals: [nodeExternals()],
}

function onBuild(done) {
    return function(err, stats) {
        if(err) {
            console.log('Error', err);
        }
        else {
            console.log(stats.toString());
        }
    
        if(done) {
            done();
        }
    }
}

gulp.task('frontend-build', function(done) {
    webpack(frontWebpackConfig).run(onBuild(done));
});

gulp.task('frontend-watch', function() {
    webpack(frontWebpackConfig).watch(100, onBuild());
});

gulp.task('backend-build', function(done) {
    webpack(backWebpackConfig).run(onBuild(done));
});

gulp.task('backend-watch', function() {
    webpack(backWebpackConfig).watch(100, onBuild());
});

gulp.task('build', ['frontend-build', 'backend-build']);
gulp.task('watch', ['frontend-watch', 'backend-watch'],()=>{

    gulp.watch(['./main.js'],['build']);
});

//start server
gulp.task('serve',[], function() {
    //var server = gls.new('main.js');
    if (server == null){
        server = gls.new('./backend.js');
    }
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['./public/bundle.js'], function (file) {
        console.log("files change???");
        if (server != null){
            server.notify.apply(server, [file]);
            server.start.bind(server)();
        }
        browserSync.reload();
    });

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['public/**/*.*'], function (file) {
        console.log("files change?");
        if (server != null){
            server.notify.apply(server, [file]);
            server.start.bind(server)();
        }
        browserSync.reload();
    });
    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
    gulp.watch('./backend.js', function() {
        server.start.bind(server)();
    });
});

//lanuch browser sync for proxy url
gulp.task('browser-sync',['serve'], function() {
    browserSync.init({
        proxy: "localhost:8080"
        ,files:['pulbic/**/*.*']
        //,browser: 'chrome'
        //,browser: 'firefox'
    });
});

gulp.task('default', ['build','watch','serve','browser-sync']);
