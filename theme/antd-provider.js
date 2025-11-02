import { ConfigProvider, Menu, theme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
// Removed AntdRegistry import as it seems to be causing a build issue
// in this environment. In a real Next.js project, you would install
// and use `@ant-design/nextjs-registry`.
// import { AntdRegistry } from "@ant-design/nextjs-registry";

/**
 * AntdProvider
 *
 * This component sets up the Ant Design ConfigProvider with a custom theme.
 *
 * It applies a custom primary color to the default Ant Design theme.
 *
 * Note: The `AntdRegistry` wrapper for Next.js App Router compatibility
 * has been removed to resolve a build error in this preview environment.
 * You would typically include it in your actual Next.js app's layout.
 */
export const AntdProvider = ({ children }) => {
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
        borderRadius: 999, // Make buttons fully rounded (pills)
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

  return (
    <AntdRegistry>
      <ConfigProvider theme={customTheme}>{children}</ConfigProvider>
    </AntdRegistry>
  );
};
