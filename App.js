import React from 'react';
import { StyleSheet } from 'react-native';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light, dark } from '@eva-design/eva';
import { Button, Text, Layout } from 'react-native-ui-kitten';

export class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout style={styles.container}>
        <Text>Use Dark Mode?</Text>
        <Button onPress={this.props.toggleTheme}>🌚{this.props.selectedTheme}</Button>
      </Layout>
    );
  }
}

const themes = { light: light, dark: dark };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'light'};
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  toggleTheme() {
    var nextTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({theme: nextTheme});
  };

  render() {
    return (
      <ApplicationProvider mapping={mapping} theme={themes[this.state.theme]}>
        <Home toggleTheme={this.toggleTheme} selectedTheme={this.state.theme} />
      </ApplicationProvider>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
