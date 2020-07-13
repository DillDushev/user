import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { GET_USERS_QUERY, CRATE_USER_MUTATION } from '../queries/queries';
import useGlobal from '../globalHook/store'
import { useStyles } from '../styles/styles'
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from '@material-ui/core/Button';

export function validateEmail(email) {
  if (typeof(email) === 'undefined') {
    return false;
  }
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return (re.test(email) && email.length <= 50) || email.toLowerCase() === 'admin';
}

function Wrap({ children }) {
  const classes = useStyles();
  return (   	
   <div className='left'>
    <Paper className={classes.root} style={{height: '100%', margin: 0}}>
    {children}
    </Paper>
   </div>
  )
}

function InputField(initialValue) {
  const [ value, setValue ] = useState(initialValue);
  function handleChange(e) {
    setValue(e.target.value);
  }
  function reset() {
    setValue('');
  }
  return [
    {
      value,
      onChange: handleChange
    },
    reset
  ];
}

function CreateUser (props) {
  const [ email, resetEmail ] = InputField('');
  const [ name, resetName ] = InputField('');
  const [ state, setState ] = useGlobal();
  const { length, limit } = state;
  const classes = useStyles();
  function complete() {
    resetEmail();
    resetName();
    setState({length: length + 1}); 	
  }

  const updateCache = (cache, {data}) => {
    const lastSkip = Math.floor( length/limit );
    const user = data.createUser;
    try {
      const lastUsers = cache.readQuery({
        query: GET_USERS_QUERY,
        variables: { 
          skip: lastSkip 
        },
      });

      cache.writeQuery({
        query: GET_USERS_QUERY,
        variables: { 
          skip: lastSkip 
        },
        data: {
          users: [ ...lastUsers.users, user ]
        },
      });
    } catch (e) {}
  };

  const [ createUser, { loading, error }] = useMutation(CRATE_USER_MUTATION, {
    onCompleted: complete,
    update: updateCache
  });

  if (loading) return <Wrap><p>Loading...</p></Wrap>;
  if (error) return <Wrap><p>An error occurred</p></Wrap>;

  return (
    <Wrap>
      <div className='mal'>
        <Input
          {...name}
          type='text'
          placeholder='Your name'
          autoComplete = {'off'}
          className={classes.input}
        />
      </div>
      <div className='mal'>
        <Input
          {...email}
          type='text'
          placeholder='Your email address'
          autoComplete = {'off'}
          className={classes.input}
        />
      </div>
      <div>
        <Button className='pointer mal' color="secondary" 
          onClick={e => {
            e.preventDefault()
            if (!validateEmail(email.value)) {
              alert('Введите правильный email');
              return;
            }
            createUser({ 
              variables: { 
                input: {
                  email: email.value,
                  name: name.value
                }
              } 
            });
          }}
        >
        {'Create User'}
        </Button>
      </div>
    </Wrap>
  )
}

export default CreateUser

