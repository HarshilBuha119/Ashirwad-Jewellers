import { Share } from 'react-native';

const APP_SCHEME = 'myapp://';

// Generate deep link
export const generateDeepLink = (product, params = {}) => {
  return `${APP_SCHEME}product/${product.id}?carat=${params.carat}&color=${params.color}&width=${params.width}`;
};

// ✅ NEW: Share the deep link directly
export const shareProduct = async (product, params = {}) => {
  try {
    const deepLink = generateDeepLink(product, params);
    const shareMessage = `Check out this ${product.name} from ${product.brand}!\n\n${deepLink}`;

    const result = await Share.share({
      message: shareMessage,
      title: product.name,
    });

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing:', error);
    throw error;
  }
};

// Parse incoming deep links
export const parseDeepLink = (url) => {
  try {
    const parsed = url.replace(`${APP_SCHEME}`, '');
    const [route, params] = parsed.split('?');
    const [screen, id] = route.split('/');
    const queryParams = new URLSearchParams(params);

    return {
      screen,
      productId: id,
      carat: queryParams.get('carat'),
      color: queryParams.get('color'),
      width: queryParams.get('width'),
    };
  } catch (error) {
    return null;
  }
};
