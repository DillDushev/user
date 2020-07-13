import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'

const client = new ApolloClient({
  uri: `http://localhost:8080/graphql`
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Header />
      <Main />
      <Footer />
    </ApolloProvider>
  );
}

export default App;
