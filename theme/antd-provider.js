import { ConfigProvider, Menu, theme } from 'antd';

export const App = ({ children }) => {
  // Define your custom theme configuration
  const customTheme = {
    // Use the default algorithm as a base
    algorithm: theme.defaultAlgorithm,
    token: {
      // Set the custom primary color
      // This color will be used for buttons, links, active states, etc.
      colorPrimary: '#226B3E',
      borderRadius: 6, // You can customize other tokens here as well
    },
    components: {
      // You can add component-specific overrides here
      // For example, to make all buttons rounded:
      Button: {
        borderRadius: 10, // Make buttons fully rounded (pills)
        controlHeight: 40, // Increase default button height
        fontWeight: 600, // Make button text bolder
      },
      Input: {
        controlHeight: 40, // Increase default input height
      },
      Menu: {
        itemActiveBg: '#DCFCE7',
        itemSelectedBg: '#DCFCE7',
      },
    },
  };

  return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
};
