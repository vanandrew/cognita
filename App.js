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

// Define URLs
const TEMPORARY_CREDENTIAL_REQUEST = 'https://www.zotero.org/oauth/request';
const TOKEN_REQUEST_URL = 'https://www.zotero.org/oauth/access';
const RESOURCE_OWNER_AUTHORIZATION_URI = 'https://www.zotero.org/oauth/authorize';

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
            url: TEMPORARY_CREDENTIAL_REQUEST,
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
        });
      }
    ).catch(error => {
      console.warn(error);
    });
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
