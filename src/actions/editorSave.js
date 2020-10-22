import axios from 'axios';
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// export const save = (data) => {
export const save = async (data) => {
    const body = JSON.stringify({data})
    try {
        // axios.post('/post/pdfmake', data)
        await axios.post('/pdfmake',body,config)
    } catch (err) {
        console.log(err);
    }
}