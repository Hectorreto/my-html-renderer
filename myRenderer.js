(() => {
  const myState = state;
  const entries = Object.entries(myState);
  const renders = Object.fromEntries(entries.map(([key]) => [key, []]))
  const regexp = /{([^}]*)}/g
  const elements = document.getElementsByClassName('auto')

  entries.forEach(([key]) => delete myState[key])
  
  entries.forEach(([key, value]) => {
    myState[`_${key}`] = value
    Object.defineProperty(myState, key, {
      set: function (value) {
        myState[`_${key}`] = value
        renders[key].forEach(f => f())
      },
      get: function() {
        return myState[`_${key}`]
      }
    })
  })
  
  Array.from(elements).forEach(element => {
    const text = element.innerHTML;
    if (typeof text === 'string') {
      const matches = Array.from(text.matchAll(regexp))
      const variables = Array.from(new Set(matches.map(m => m[1])))
        .filter(variable => myState[variable] !== undefined)

      const render = () => {
        element.innerHTML = text.replace(regexp, (...args) => {
          return myState[args[1]] ?? args[0];
        })
      }

      variables.forEach(variable => {
        renders[variable].push(render);
      })

      render();
    }
  })
})()