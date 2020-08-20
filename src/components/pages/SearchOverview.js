import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
	InstantSearch,
	Hits,
	SearchBox,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList,
	Configure,
} from 'react-instantsearch-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(20),
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

const SearchOverview = () => {
	const searchClient = algoliasearch(
		process.env.REACT_APP_ALGOLIA_APP_ID,
		process.env.REACT_APP_ALGOLIA_SEARCH_ID
	);
	const history = useHistory();
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<InstantSearch searchClient={searchClient} indexName='notes'>
				<div className='right-panel'>
					<SearchBox />
					<Hits />
					<Pagination />
				</div>
			</InstantSearch>
		</div>
	);
};

export default SearchOverview;
