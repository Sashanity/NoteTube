import React from 'react'
import Register from '../auth/Register'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    box: {
        display: 'flex',
        height: 700,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "Aspira Webfont, Helvetica, Arial, sans-serif",
        fontSize: 50,
        fontWeight: 200,
        color: 'white',
    },
    box2: {
        display: 'flex',
        height: 500,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "Aspira Webfont, Helvetica, Arial, sans-serif",
        fontSize: 30,
        fontWeight: 200,
        color: 'white',
    }
  }));
  
  
const Landing = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <Grid container spacing = {2} direction = "column">
            <Grid item  xs = {12} container>
                <Grid item xs = {3}/>
                <Grid item xs = {4}>
                    <Box className = {classes.box}>
                        Study Smarter with NoteTube
                    </Box>
                </Grid>
                <Grid item xs = {5}>
                    <Register/>
                </Grid>
            </Grid>
            <br/>
            <br/>
            <Grid item xs = {12}>
                <Divider/>
            </Grid>
            <Grid item xs = {12} container >
                <Grid item xs = {3}/>
                <Grid item xs = {5}>
                    <Box className = {classes.box2}>
                        Access Millions of Published Notes
                    </Box>
                </Grid>
                <Grid item xs = {3}>
                </Grid>
            </Grid>
            <Grid item xs = {12}>
                <Divider/>
            </Grid>
            <Grid item xs = {12} container >
                <Grid item xs = {3}/>
                <Grid item xs = {5}>
                    <Box className = {classes.box2}>
                        Create and Publish Your Own Notes
                    </Box>
                </Grid>
                <Grid item xs = {3}>

                </Grid>
            </Grid>
            <Grid item xs = {12}>
                <Divider/>
            </Grid>
            <Grid item xs = {12} container >
                <Grid item xs = {3}/>
                <Grid item xs = {5}>
                    <Box className = {classes.box2}>
                        Create Private Groups and Study with Friends
                    </Box>
                </Grid>
                <Grid item xs = {3}>
                </Grid>
            </Grid>
        </Grid>
        </div>

    )
}

export default Landing
