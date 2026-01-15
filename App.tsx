// App.js
import React, { useEffect, useRef } from 'react';
import { Linking, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from "./App/navigation/AppNavigator"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AuthProvider, { AuthContext } from './App/context/AuthContext';
import notifee from "@notifee/react-native";
import { CartProvider } from './App/context/CartContext'
import { FavoritesProvider } from './App/context/FavouritesContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { parseDeepLink } from './App/utils/deepLinkGenerator'
import { products } from './App/data/homeData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
GoogleSignin.configure({
  webClientId:
    '337803005366-hlkdut89nsphkpf4g073eejusr6j0jrg.apps.googleusercontent.com',
});
export default function App() {
  const navigationRef = useRef(null);
  useEffect(() => {
    async function setup() {
      // Request permission (Android 13+)
      await notifee.requestPermission();  // <-- REQUIRED

      await notifee.createChannel({
        id: "money-reminders",
        name: "Money Reminders",
        importance: 4,
      });
    }
    setup();
    const handleDeepLink = (url) => {
      console.log('🔗 Deep link received:', url);

      try {
        const parsed = parseDeepLink(url);
        console.log('📦 Parsed:', parsed);

        if (parsed && parsed.screen === 'product') {
          const fullProduct = products.find(p => p.id === parsed.productId);

          console.log('🔍 Looking for product ID:', parsed.productId);
          console.log('✅ Product found:', fullProduct?.name);

          if (fullProduct) {
            // ✅ CRITICAL: setTimeout ensures navigation is ready
            setTimeout(() => {
              console.log('🚀 Navigating to ProductDetail...');

              navigationRef.current?.navigate('ProductDetail', {
                product: fullProduct,
                selectedCarat: parsed.carat || '18K',      // ✅ Fallback
                selectedColor: parsed.color || 'Gold',     // ✅ Fallback
                selectedWidth: parsed.width || '2.5',      // ✅ Fallback
              });

              console.log('✅ Navigation called');
            }, 500);  // ✅ 500ms delay is important!
          } else {
            console.warn('⚠️ Product not found with ID:', parsed.productId);
          }
        } else {
          console.warn('⚠️ Deep link has no product screen:', parsed);
        }
      } catch (error) {
        console.error('❌ Error handling deep link:', error);
      }
    };


    // Get initial URL if app was opened from deep link
    Linking.getInitialURL().then((url) => {
      if (url != null) {
        handleDeepLink(url);
      }
    });

    // Listen for deep links while app is open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <CartProvider>
            <AuthProvider>
              <AuthContext.Consumer>
                {({ user }) => (
                  <NavigationContainer ref={navigationRef}>
                    <StatusBar barStyle="dark-content" />
                    <AppNavigator />
                  </NavigationContainer>
                )}
              </AuthContext.Consumer>
            </AuthProvider>
          </CartProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
