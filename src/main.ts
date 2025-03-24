import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUser, faStore, faCoins, faTicketAlt, 
  faSpinner, faExclamationCircle 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 添加圖標到庫
library.add(
  faUser, faStore, faCoins, faTicketAlt, 
  faSpinner, faExclamationCircle
);

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
