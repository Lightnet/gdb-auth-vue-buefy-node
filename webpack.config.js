const path = require('path');
const fs = require('fs');

module.exports = {
    mode:'development',
    entry:  ['babel-polyfill','./src/client/clientEntryPoint.js'],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    //watch: true,
    module: {
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
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-env'].map(require.resolve)
                }
            }
      ]
    },
    resolve: {
        alias: { 
            
        }
    }
};