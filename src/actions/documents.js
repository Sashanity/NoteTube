import axios from 'axios';
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const upload = (
  checkedA,
  name,
  course,
  instructor,
  term,
  subject,
  files
) => {
  let data = {
    checkedA,
    name,
    course,
    instructor,
    term,
    subject,
    files,
  };

  try {
    axios.post('/post/upload', data);
  } catch (err) {
    console.log(err);
  }
};

export const search = async (history, searchInput) => {
  try {
    const res = await axios.get(
      '/search',
      {
        params: {
          searchInput: searchInput,
        },
      },
      config
    );
    history.push('/searchOverview', res.data);
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getUserNotes = async () => {
  let token = localStorage.getItem('token');
  console.log(token);
  try {
    let res = await axios.get('/userList', { params: { token } });
    return res.data.retList;
  } catch (err) {
    console.log('Error: ', err);
  }
};

export const deleteNoteDB = async (noteid) => {
  // console.log('IN DELETE ACTION')
  // console.log('NOTEID', noteid)
  let token = localStorage.getItem('token');
  try {
    const res = await axios.delete('/deleteNote', {
      params: { noteid, token },
    });
    return res.status;
  } catch (err) {
    console.log(err);
  }
};

export const notePreview = async (history, noteid) => {
  console.log('IN NOTE PREVIEW ACTION');
  console.log('NOTEID', noteid);
  window.open(
    'http://localhost:5000/notetube-f3f9c/us-central1/api/preview?noteid=' +
    noteid +
    '&token=' +
    localStorage.getItem('token'),
    '_blank'
  );
};
