module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333/api',
    eas: {
      projectId: '544e8ddc-9907-4eff-aa4f-3d4746f52dbb',
    },
  },
});
