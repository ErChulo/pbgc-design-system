/** @type {import('@storybook/react-vite').StorybookConfig} */
export default {
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Official logo artwork is copied here by a human (see assets/logos/MANIFEST.md); it is not generated.
  staticDirs: [{ from: '../assets/logos', to: '/logos' }],
  // No telemetry: this is a federal-agency project and the build must make no outbound calls.
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};
