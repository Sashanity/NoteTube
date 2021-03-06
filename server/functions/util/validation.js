const isEmail = (email) => {
    const regEx = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(sjsu)\.edu$/;
    if (email.match(regEx)) return true;
    else return false;
};

const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
};

const isValidLength = (string, minLength) => {
    if (string.length >= minLength) return true;
    else return false;
}

const hasWhiteSpace = (string) => {
    const regex = /\s/g;
    return regex.test(string);

}

exports.validateSignup = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address';
    }
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (!isValidLength(data.password, 6)) errors.password = 'Must be at least 6 characters';
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords must match';

    if (isEmpty(data.username)) errors.username = 'Must not be empty';
    if (hasWhiteSpace(data.username)) errors.username = 'Must not contain invalid characters';
    
    if (isEmpty(data.firstname)) errors.firstname = 'Must not be empty';
    if (isEmpty(data.lastname)) errors.lastname = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateLogin = (data) => {
    let errors = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

