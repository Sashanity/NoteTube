import axios from 'axios';
const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

export const upload = (checkedA,	name, course,	instructor,  term,  subject, files ) => {
	let data = {
	  checkedA,
	  name,
	  course,
	  instructor,
	  term, 
	  subject,
	  files 
	}

	try { 
	  axios.post('/post/upload', data) 
	} catch (err) {
	  console.log(err);
	  }
  }


  export const DisplayClassNotes = () => {
	

	try { 
	  axios.get('/preview') 
	} catch (err) {
	  console.log(err);
	  }
  }



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
