import axios from 'axios';
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// export const save = (data) => {
export const save = () => {
    try {
        // axios.post('/post/pdfmake', data)
        axios.post('/pdfmake')
    } catch (err) {
        console.log(err);
    }
}