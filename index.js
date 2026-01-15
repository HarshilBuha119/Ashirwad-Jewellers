/**
 * @format
 */
import 'react-native-url-polyfill/auto';
import notifee, { EventType } from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log("Background notification:", type, detail);
});
