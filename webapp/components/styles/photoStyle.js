export default {
  control: {
    backgroundColor: '#fff',
    fontSize: 15,
    fontWeight: 'normal',
  },
  '&singleLine': {
    control: {
      border: '1px solid silver',
    },
    highlighter: {
      padding: 10,
    },
    input: {
      border: 0,
      border: '2px',
      outline: 0,
      padding: 10,
    },
  },
  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      border: '1px solid silver',
    },
    highlighter: {
      padding: 10,
    },
    input: {
      padding: 10,
      outline: 0,
      border: 0,
    },
  },
  highlighter: {
    overflow: 'hidden',
  },
  input: {
    margin: 0,
  },
  control: {
    backgroundColor: '#fff',
    fontSize: 15,
    fontWeight: 'normal',
  },
  highlighter: {
    overflow: 'hidden',
  },
  input: {
    margin: 0,
  },
  '&singleLine': {
    control: {
      border: '1px solid silver',
    },
    highlighter: {
      padding: 10,
    },
    input: {
      padding: 10,
      outline: 0,
      border: 0,
      border: '2px',
    },
  },
  
  position: 'absolute',
  suggestions: {
    overflow: 'visible',
    list: {
      backgroundColor: 'white',
      border: '1px solid rgb(0,0,0)',
      bottom: 10,
      fontSize: 15,
      margin: 10,
      overflow: 'visible',
      padding: 5,
    },
    item: {
      padding: '10px',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
  width: '100%',
}