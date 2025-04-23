import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import './style.css'

// Create pinia (store)
const pinia = createPinia()

const messages = {
  en: {
    myKvk: 'My KVK',
    depositYourAnnual: 'Deposit your annual accounts or request your identification details of legal entities for your Organization Wallet.',
    loginWithDigiD: 'Login with DigiD Hoog',
    moreInformation: 'More information',
    organizationWallet: 'Organization Wallet',
    requestKvKAttestations: 'Request KVK attestations for your Organization Wallet.',
    loginWithEUWallet: 'Login with EU Wallet',
    language: 'English',
    login: 'Login',
    search: 'Search',
    current: 'Current',
    entrepreneurship: 'Entrepreneurship',
    register: 'Register',
    helpContact: 'Help & Contact',
    popupTitle: 'Scan the QR with your EU Wallet:',
    popupSubtitle: 'These 3 fields below should be replaced with NP wallet authentication flow',
    familyName: 'Family name:',
    name: 'Name:',
    birthdate: 'Birthdate:',
    cancel: 'Cancel',
    kvkNumber: 'KVK number:',
    chooseWallet: 'Choose an organizational wallet to issue credentials to',
    createOrganizationalWallet: 'Issue Credentials',
    connectExistingWallet: 'Connect existing organizational wallet',
    alreadyHaveWallet: 'Already have an organizational wallet?',
    organizationalWallet: 'Organizational wallet',
    createWalletFlow: 'The create organizational wallet flow at Gimly should now be initialized.',
    connectWalletTitle: 'Connect your organizational wallet',
    connectWalletSubtitle: 'We have to connect your installed organizational wallet with our data to activate the wallet. Please provide below\'s information to validate your organizational wallet:',
    walletUrl: 'URL to organizational wallet:',
    validate: 'Validate wallet',
    close: 'Close',
    cancel: 'Cancel',
  },
  nl: {
    myKvk: 'Mijn KVK',
    depositYourAnnual: 'Deponeer uw jaarrekening of vraag uw identificatiegegevens van rechtspersonen aan voor uw Organisatie Wallet aan.',
    loginWithDigiD: 'Log in met DigiD Hoog',
    moreInformation: 'Meer informatie',
    organizationWallet: 'Organisatie Wallet',
    requestKvKAttestations: 'Vraag KVK attesties op voor in uw Organisatie Wallet.',
    loginWithEUWallet: 'Log in met EU Wallet',
    language: 'Nederlands',
    login: 'Inloggen',
    search: 'Zoeken',
    current: 'Actueel',
    entrepreneurship: 'Ondernemen',
    register: 'Handelsregister',
    helpContact: 'Hulp & Contact',
    popupTitle: 'Scan de QR met je EU Wallet:',
    popupSubtitle: 'Deze 3 velden hieronder moet worden vervangen door NP wallet-authenticatiestroom',
    familyName: 'Achternaam:',
    name: 'Naam:',
    birthdate: 'Geboortedatum:',
    cancel: 'Annuleren',
    kvkNumber: 'KVK nummer:',
    chooseWallet: 'Kies een organisatie wallet om credentials naar te sturen',
    createOrganizationalWallet: 'Credentials uitgeven',
    connectExistingWallet: 'Verbind bestaande organisatie wallet',
    alreadyHaveWallet: 'Heeft u al een organisatie wallet?',
    organizationalWallet: 'Organisatie wallet',
    createWalletFlow: 'De aanmaak van de organisatie wallet bij Gimly zou nu moeten starten.',
    connectWalletTitle: 'Verbind uw organisatie wallet',
    connectWalletSubtitle: 'We moeten uw geïnstalleerde organisatie wallet met onze gegevens verbinden om de wallet te activeren. Geef hieronder de informatie op om uw organisatie wallet te valideren:',
    walletUrl: 'URL naar organisatie wallet:',
    validate: 'Valideer wallet',
    close: 'Sluiten',
    cancel: 'Annuleren',
  }
}

const i18n = createI18n({
  locale: 'nl',
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
app.mount('#app')
