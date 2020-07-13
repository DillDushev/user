import React from 'react';
import Button from '@material-ui/core/Button';
import useGlobal from '../globalHook/store';

export const Pagination = () => {
  const [ state, setState ] = useGlobal();
  const { skip, length, limit, BUTN_NUM } = state;
  const index = skip;
  let numbers = [];
  const pageNum = Math.floor((length-1)/limit);
  const min = (index - BUTN_NUM > 0) ? (index - BUTN_NUM) : 0;
  const max = (index + BUTN_NUM < pageNum) ? (index + BUTN_NUM) : (pageNum); 

  for( let i = min; i <= max; i++ ) {
    numbers.push(i);
  }
	
  const is = (i) => i === index

	return (
    <div className = 'mal'>
    {pageNum > 1 && 
      <div style = {{display: 'inline-block'}}>
        <Button 
          color={index === 0 ? 'secondary' : 'default'}
          disabled = {index === 0 ? true : false}
          onClick={() => setState({skip: 0})}
        >
        {'<<'}
        </Button>
        <Button
          disabled = {index === 0 ? true : false}
          onClick={() => setState({skip: index - 1})}
        >Prev
        </Button>
      </div>
    }
    <div style = {{display: 'inline-block'}}>
    {numbers.map((n, i) => 
      <Button
        key = {i}
        style = {{
          cursor: is(n) ? 'default' : 'pointer',
          color: is(n) ? '#333' : '#ff4500', 
        }}
        onClick={ () => is(n) ? null : setState({skip: n}) }
      >
      {`${n + 1}`}
      </Button>
    )}
    </div>
    {pageNum > 1 &&
      <div style = {{display: 'inline-block'}}>
        <Button
          disabled = {index >= (length/limit) - 1 ? true : false }
          onClick = {() => setState({skip: index + 1})}
        >Next
        </Button>
        <Button 
          disabled = {index >= (length/limit) - 1 ? true : false}
          onClick = {() => is(pageNum) ? null : setState({skip: pageNum})}
        >
        {'>>'}
        </Button>
      </div>
    }
    </div>
  )
}