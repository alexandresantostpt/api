const patterns = {
    CNPJ: /(([\d]{2})(.)([\d]{3})(.)([\d]{3})(\/)([\d]{4})(-)([\d]{2}))/,
    CPF: /(([\d]{3})(.)([\d]{3})(.)([\d]{3})(-)([\d]{2}))/,
    FLIGHT_NUMBER: /^(([\dA-Z]{1,3})([\s])([\d]{1,6}))$/
}

export { patterns }