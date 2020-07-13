function setState(newState) {
  this.state = { ...this.state, ...newState };
  this.listeners.forEach((listener) => {
    listener(this.state);
  });
}

function useCustom(React) {
  const newListener = React.useState()[1];
  React.useEffect(() => {
    this.listeners.push(newListener);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== newListener);
    };
  }, []);
  return [this.state, this.setState]; 
}

const useGlobalHook = (React, initialState) => {
  const store = { state: initialState, listeners: [] };
  store.setState = setState.bind(store);
  return useCustom.bind(store, React);
};

export default useGlobalHook;