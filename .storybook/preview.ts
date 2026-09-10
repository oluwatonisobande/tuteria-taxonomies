import '../src/index.css';
import '../src/styles/tokens.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'canvas', value: '#F9FAFB' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (iPhone 14)',
          styles: { width: '390px', height: '844px' },
        },
        tablet: {
          name: 'Tablet (iPad Mini)',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '900px' },
        },
      },
    },
  },
};

export default preview;
