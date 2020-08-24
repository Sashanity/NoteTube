import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import 'instantsearch.css/themes/algolia.css';
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
		padding: theme.spacing(3),
	},
	// searchBox: {
	// 	justifyContent: 'center',
	// 	width: 600,
	// 	height: 300,
	// },
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
				<Grid container spacing={2} direction='column'>
					<Grid item xs={12} container>
						<Grid item xs={3} />
						<Grid item xs={5}>
							<SearchBox onSubmit />
						</Grid>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={3} />
						<Grid item xs={5}>
							<Hits />
						</Grid>
					</Grid>
				</Grid>
			</InstantSearch>
		</div>
	);
};

export default SearchOverview;
