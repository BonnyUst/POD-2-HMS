const { nanoid } = require('nanoid')

const generateId = () => {
    return `${nanoid(6).toUpperCase()}`;
}
module.exports = generateId;