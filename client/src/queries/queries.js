import {gql} from 'apollo-boost'

const GET_TOTAL_QUERY = gql`
  query {
    total {
      total
    }
  }
` 

const GET_USER_QUERY = gql`
  query($id:ID!) {
    users (id: $id ) {
      id
      name
      email
    }
  }
` 

const GET_USERS_QUERY = gql`
	query($skip:Int!) {
		users (skip: $skip ) {
			id
			name
			email
		}
	}
` 

const CRATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export {GET_USER_QUERY, GET_USERS_QUERY, GET_TOTAL_QUERY, CRATE_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION}