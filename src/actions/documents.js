import axios from 'axios';
const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

export const upload = (checkedA, name, course, instructor, term, subject, files) => {
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
		// change the Url /preview
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

export const getUserNotes = async () => {
	let token = localStorage.getItem('token');
	console.log(token)
	try {
		let res = await axios.get('/userList', { params: { token } })
		return res.data.retList

	} catch (err) {
		console.log('Error: ', err);
	}
}

export const deleteNoteDB = async (noteid) => {
	try {
		const res = await axios.delete('/deleteNote', { params: { noteid: noteid } })
		return res.status
	}
	catch (err) {
		console.log(err);
	}
}