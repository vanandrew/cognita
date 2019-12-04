import React from 'react';
import {
  Button,
  Header,
  Text,
  ThemeProvider
} from 'react-native-elements';
import { theme } from './theme';
import {
  CLIENTKEY,
  CLIENTSECRET
} from 'react-native-dotenv';
import OAuth from 'oauth-1.0a';
import cryptojs from 'crypto-js';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import { Linking, WebBrowser } from 'expo';

// Define URLs
const TEMPORARY_CREDENTIAL_REQUEST = 'https://www.zotero.org/oauth/request';
const TOKEN_REQUEST_URL = 'https://www.zotero.org/oauth/access';
const RESOURCE_OWNER_AUTHORIZATION_URI = 'https://www.zotero.org/oauth/authorize';
const APP_CALLBACK_URL = 'exp://wg-qka.community.app.exp.direct:80';

const oauth = OAuth({
    consumer: { key: CLIENTKEY, secret: CLIENTSECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return hmacSHA1(base_string,key).toString(cryptojs.enc.Base64)
    },
})

// Application entry component
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: ''
    };
  }

  componentDidMount() {
    // set self
    var self = this;

    fetch(
      TEMPORARY_CREDENTIAL_REQUEST,
      {
        headers: {...oauth.toHeader(oauth.authorize({
            url: `${TEMPORARY_CREDENTIAL_REQUEST}?oauth_callback=${APP_CALLBACK_URL}`,
            method: 'GET'
          })),
        }
      }
    ).then( response => {
        if (!response.ok) { throw Error(response.statusText); }
        response.text().then( text => {
          var response_object = Object();
          var data = text.split('&');
          for (var element of data) {
            var [key, value] = element.split('=');
            response_object[key] = value;
          }
          console.log(response_object);

          var RESOURCE_OWNER_KEY = response_object['oauth_token'];
          var RESOURCE_OWNER_SECRET = response_object['oauth_token_secret'];

          self._openBrowserLink(`${RESOURCE_OWNER_AUTHORIZATION_URI}?oauth_token=${RESOURCE_OWNER_KEY}`);

        });
      }
    ).catch(error => {
      console.warn(error);
    });
  }

  async _openBrowserLink(weblink) {
    let result = await WebBrowser.openBrowserAsync(weblink)
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Header
          leftComponent={{ icon: 'menu' }}
          centerComponent={{ text: 'cognita' }}
        />
      <Text>CLIENTKEY={CLIENTKEY}</Text>
      <Text>CLIENTSECRET={CLIENTSECRET}</Text>
      </ThemeProvider>
    );
  }
}
