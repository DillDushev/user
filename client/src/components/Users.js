import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { Pagination } from './Pagination';
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { useQuery } from '@apollo/react-hooks';
import { useStyles } from '../styles/styles';
import { useMutation } from '@apollo/react-hooks';
import { GET_USERS_QUERY, UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from '../queries/queries';
import useGlobal from '../globalHook/store';

const InputTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align='left' className={classes.tableCell}>
    {isEditMode ? (
      <Input
        value={row[name]}
        name={name}
        onChange={e => onChange(e, row)}
        className={classes.input}
      />
      ) : (
      row[name]
    )}
    </TableCell>
  );
};

function useUsers() {
  const state = useGlobal()[0];
  const { skip } = state;
  const { data , error, loading } = useQuery(GET_USERS_QUERY, {
    variables: {
      skip: skip
    },
    fetchPolicy: 'network-only'
  });
  return [ data, error, loading ];
}

function useDelete() {
  const [ state, setState ] = useGlobal();
  const { skip, length, limit } = state;
  const [ deleteUser, { error, loading }] = useMutation(DELETE_USER_MUTATION, {
    onCompleted(data) {
       let ns = {
        length: length - 1, 
        skip,
      }
      if (skip * limit === length - 1) {
        ns = {...ns, skip: skip - 1}
      }
      setState(ns)
    },
    refetchQueries: [{
      query: GET_USERS_QUERY, 
      variables: { 
        skip: skip 
      },
    }]
  });
  return [ deleteUser, error, loading ];
}

function useUpdate() {
  const state = useGlobal()[0];
  const { skip } = state;
  const [ updateUser, { error, loading }] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [{
      query: GET_USERS_QUERY, 
      variables: { 
        skip 
      }
    }]
  });
  return [ updateUser, error, loading ];
}

function Users() {
  const [ data, error, loading ] = useUsers();
  const [ rows, setRows ] = useState([]);
  
  React.useEffect(() => {
    if(data) {
      const newRows = data.users.map(d => ({...d, isEditMode: false}))
      setRows(newRows);
    }
  }, [data]);

  const [previous, setPrevious] = useState({});
  const [deleteUser, deletError] = useDelete();
  const [updateUser, updateError] = useUpdate();
  const classes = useStyles();

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          updateUser({ 
            variables: {
              id, 
              input: {
                email: row.email,
                name: row.name
              }
            } 
          });
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };
  
  if (updateError) {
    alert('Error update')
  }

  if (deletError) {
    alert('Error delete')
  }

  if (loading) return <div><p>Loading...</p></div>;
  if (error) return <div><p>Error :(</p></div>;

  return (
    <Paper className={classes.root} style={{overflowY: 'auto'}}>
      <Table className={classes.table} aria-label='caption table'>
        <TableHead>
          <TableRow> 
            <TableCell align='left'>ID</TableCell>
            <TableCell align='left' />
            <TableCell align='left'>NAME</TableCell>
            <TableCell align='left'>EMAIL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map(row => (
          <TableRow key={row.id}>
            <TableCell className={classes.selectTableCell}>{row.id}</TableCell>
            <TableCell className={classes.selectTableCell}>
            {row.isEditMode ? (
                <span>
                  <IconButton
                    aria-label='done'
                    onClick={() => onToggleEditMode(row.id)}
                  >
                    <DoneIcon />
                  </IconButton>
                </span>
              ) : (
                <IconButton
                    aria-label='delete'
                    onClick={() => onToggleEditMode(row.id)}
                  >
                    <EditIcon />
                </IconButton>
              )
            }
            </TableCell>  
            <InputTableCell {...{ row, name: 'name', onChange }} />
            <InputTableCell {...{ row, name: 'email', onChange }} />
            <TableCell className={classes.selectTableCell}>
              <IconButton
                aria-label='delete'
                onClick={(e) => {
                  deleteUser({ 
                    variables: { 
                      id: row.id
                    } 
                  });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>
      <Pagination />
    </Paper>
  );
}

export default Users
