module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@stores': './src/stores',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@helpers': './src/helpers',
          '@pages': './src/pages',
          '@styles': './src/styles',
        },
      },
    ],
  ],
};
