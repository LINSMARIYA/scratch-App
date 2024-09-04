// webpack.config.js
import { resolve as _resolve, join } from 'path';

export const entry = './src/index.tsx';
export const output = {
  filename: 'bundle.js',
  path: _resolve(__dirname, 'dist'),
};
export const resolve = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
};
export const module = {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(png|jpe?g|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'static/media',
          },
        },
      ],
    },
  ],
};
export const devServer = {
  contentBase: join(__dirname, 'dist'),
  compress: true,
  port: 9000,
};