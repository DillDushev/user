import React from 'react';
import Users from './Users';
import AddUser from './AddUser';
import useGlobal from '../globalHook/store';
import { GET_TOTAL_QUERY } from '../queries/queries';
import { useQuery } from '@apollo/react-hooks';

function Main () {
  const setState = useGlobal()[1];
  const { data, loading, error } = useQuery(GET_TOTAL_QUERY, {
    onCompleted(data) {
      const { total } = data;
      setState({ length: total.total });
    }
  });

  return (
    <div className='block'>
      <AddUser />
      <div className = 'right' style={{ overflowY: 'auto' }}>
        <Users {...{ loadingTotal: loading, errorTotal: error }} />
      </div>
    </div>
  )
}

export default Main;