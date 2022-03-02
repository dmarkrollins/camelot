const Camelot = {}

Camelot.Keys = {
    DIAGRAM: 'diagram',
    LIBRARIES: 'libraries'
}

Camelot.LocalStorage = {
    set: function (key, value, isJson = false) {
        const val = isJson ? JSON.stringify(value) : value
        localStorage.setItem(key, val)
    },
    get: function (key, defaultValue = '', isJson = false) {
        const defaultRetVal = defaultValue || ''

        const val = localStorage.getItem(key) || defaultRetVal

        if (isJson && val !== '') {
            try {
                return JSON.parse(val)
            }
            catch {
                return defaultValue
            }
        }

        return val
    }
}

Camelot.randomChoice = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

Camelot.validateDiagramName = (name) => {
    if (name.trim() === '' || name.trim().length < 5) {
        throw new Error('Diagram name required and must be 5 characters or more!')
    }
}

export default Camelot