const convertAllKeyToString = obj =>
    Object.entries(obj).reduce((newObj, [key, value]) => {
        newObj[key] = value ? (typeof value === 'object' ? JSON.stringify(convertAllKeyToString(value)) : value.toString()) : ''
        return newObj
    }, {})

export { convertAllKeyToString }
