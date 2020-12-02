import axios from 'axios';
const fs = require('fs');
const os = require('os');
const path = require('path');
/*const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};*/

 export const upload = async (
   checked,
   name,
   course,
   instructor,
   term,
   subject,
   file
 ) => {
   let formData = new FormData();
   let publicFile;
   if (checked) {
     publicFile = 'true';
   } else {
     publicFile = 'false';
   }
   //var fileBlob = new Blob([fileState], {type: 'application/pdf'});
   //formData.append('token', localStorage.getItem('token'));
   formData.append('public', publicFile);
   formData.append('name', name);
   formData.append('course', course);
   formData.append('instructor', instructor);
   formData.append('term', term);
   formData.append('subject', subject);
   formData.append('file', file);
   
   
    console.log(formData);
   let token = localStorage.getItem('token');
   const formConfig = { headers: {'content-type': 'multipart/form-data'}}
   try {
      //axios.post('/upload', formData, formConfig);
     await axios.post(`/upload?token=${token}`, formData);
     
   } catch (err) {
     console.log(err);
   }
 };



/*export const upload = async (checked, name, course, instructor, term, subject, fileState) => {
  console.log('IN UPLOAD FUNCITON')
  let token = localStorage.getItem('token')
  let publicFile;
  if (checked) {
    publicFile = 'true';
  } else {
    publicFile = 'false';
  }
  try {
    axios.post('/upload', {
      headers: {
        'Connection': 'keep-alive',
        'Content-Type': 'multipart/form-data'
        // 'Content-Type': 'application/json;charset=UTF-8',
      },
      formData: {
        file: {
          value: fileState,
          // options: {
          //   knownLength: headers['content-length']
          // }
        },
        course: { value: course },
        instructor: { value: instructor },
        term: { value: term },
        subject: { value: subject },
        name: { value: name },
        publicFile: { value: publicFile }
      }
    })

  } catch (err) {
    console.log(err)
  }
}*/


export const search = async (history, searchInput) => {
  try {
    const res = await axios.get(
      '/search',
      {
        params: {
          searchInput: searchInput,
        },
      
      headers: {
        'Content-Type': 'application/json',
      },
    },
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
    console.log(res.data.retList);
    return res.data.retList;
  } catch (err) {
    console.log('Error: ', err);
  }
};

export const deleteNoteDB = async (noteid, public_status) => {
  console.log('IN DELETE ACTION');
  console.log('NOTEID', noteid);
  let token = localStorage.getItem('token');
  try {
    const res = await axios.delete('/deleteNote', {
      params: { noteid, token, public_status },
    });
    console.log('DELETE STATUS:', res.status);
    return res.status;
  } catch (err) {
    console.log(err);
  }
};

export const notePreview = async (history, noteid, public_status) => {
  console.log('IN NOTE PREVIEW ACTION');
  console.log('NOTEID', noteid);
  let url =
    'http://localhost:5000/notetube-f3f9c/us-central1/api/preview?noteid=' +
    noteid +
    '&public=' +
    public_status +
    '&token=' +
    localStorage.getItem('token');
  window.open(url, '_blank');
};
