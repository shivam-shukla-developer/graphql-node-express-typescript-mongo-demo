import { useEffect, useState, memo, useCallback, forwardRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';

import { Typography, Stack, IconButton, Alert as MuiAlert, Snackbar, Button } from '@mui/material';
import { getAuthors, removeAuthor } from '../../services/author'

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddAuthor from './AddAuthor';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Authors() {
    const [authors, setAuthors] = useState([]);
    const [alertMessage, setAlertMessage] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [showAddAuthorDialog, setShowAddAuthorDialog] = useState(false);
    const navigate = useNavigate();

    const updateUsers = useCallback(() => {
        getAuthors(`id, name, books {id}`).then(response => {
            const { data: { data: { authors } } } = response;
            if (authors) setAuthors(authors)
        })
    }, []);

    useEffect(() => {
        updateUsers();
    }, [updateUsers]);

    const removeHandler = useCallback((id) => {
        removeAuthor({ id }).then((response) => {
            const { data: { data: { removeAuthor } }, data: { errors } } = response;
            if (errors !== undefined) {
                throw (errors);
            }
            updateUsers();
            setAlertMessage(`Author ${removeAuthor.name} removed successfully.`);
            setShowAlert(true);
            setAlertType(`success`);
        }).catch((errors) => {
            let errorMessage = '';
            if (Array.isArray(errors)) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                errorMessage = errorMessages.join(", ");
            } else if (typeof errors === 'object' && !Array.isArray(errors) && errors !== null && 'message' in errors) {
                errorMessage = errors.message;
            }

            setAlertMessage(errorMessage);
            setShowAlert(true);
            setAlertType(`error`);
        })
    }, [updateUsers])


    return (
        <>
            <TableContainer component={Paper}>
                <Typography variant="h4" sx={{ mt: 3 }} gutterBottom>
                    List of Authors
                    <Button sx={{ml: 5}} variant="contained" color="primary" aria-label="Add Author" component="label" onClick={() => setShowAddAuthorDialog(true)}>
                        <AddIcon /> Add Author
                    </Button>
                </Typography>

                <Table sx={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Books Published</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left" >{row.id}</TableCell>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">{row.books.length}</TableCell>
                                <TableCell align="left">
                                    <Stack direction="row" alignItems="right" spacing={2}>
                                        <IconButton color="dark" aria-label="Edit Author" component="label" onClick={() => {
                                            navigate(`/authors/${row.id}`)
                                        }}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton onClick={() => { removeHandler(row.id) }} color="error" aria-label="Remove Author" component="label">
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => { setShowAlert(false) }}>
                <Alert onClose={() => { setShowAlert(false) }} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            {
                (showAddAuthorDialog && <AddAuthor open={showAddAuthorDialog} setOpen={setShowAddAuthorDialog} updateUsers={updateUsers} />)
            }
        </>
    );
}

export default memo(Authors);