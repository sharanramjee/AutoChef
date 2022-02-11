export default {
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
  position: 'absolute',
  width: '100%',
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
  suggestions: {
    item: {
      padding: '10px',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
    list: {
      backgroundColor: 'white',
      border: '1px solid rgb(0,0,0)',
      fontSize: 15,
      overflow: 'visible',
      margin: 10,
      padding: 5,
      bottom: 10
    },
    overflow: 'visible',
  },
}