import { useEffect, useState, memo, useCallback, forwardRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, IconButton, Alert as MuiAlert, Snackbar, Button } from '@mui/material';
import { getBooks, removeBook } from '../../services/books'

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddBook from './AddBook';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Books() {
    const [books, setBooks] = useState([]);
    const [alertMessage, setAlertMessage] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [showAddBookDialog, setShowAddBookDialog] = useState(false);
    const navigate = useNavigate();

    const updateBooks = useCallback(() => {
        getBooks(`id, name, description, url, author {id, name}`).then(response => {
            const { data: { data: { books } } } = response;
            if (books) setBooks(books)
        })
    }, []);

    useEffect(() => {
        updateBooks();
    }, [updateBooks]);

    const removeHandler = useCallback((id) => {
        removeBook({ id }).then((response) => {
            const { data: { data: { removeBook } }, data: { errors } } = response;
            if (errors !== undefined) {
                throw (errors);
            }
            updateBooks();
            setAlertMessage(`Book ${removeBook.name} removed successfully.`);
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
    }, [updateBooks])


    return (
        <>
            <TableContainer component={Paper}>
                <Typography variant="h4" sx={{ mt: 3 }} gutterBottom>
                    List of Books
                    <Button sx={{ ml: 5 }} variant="contained" color="primary" aria-label="Add Author" component="label" onClick={() => setShowAddBookDialog(true)}>
                        <AddIcon /> Add Book
                    </Button>
                </Typography>

                <Table sx={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="left">Preview Url</TableCell>
                            <TableCell align="left">Author</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left" >{row.id}</TableCell>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">{(row.description ? row.description : '-')}</TableCell>
                                <TableCell align="left">{(row.url ? <Link target="_blank" href={row.url} underline="always">
                                                {row.url}
                                            </Link> : '-')}</TableCell>
                                <TableCell align="left">
                                    <Link to={`/authors/${row.author.id}`} component={RouterLink} underline="always">
                                        {row.author.name}
                                    </Link>
                                </TableCell>
                                <TableCell align="left">
                                    <Stack direction="row" alignItems="right" spacing={2}>
                                        <IconButton color="dark" aria-label="Edit Author" component="label" onClick={() => {
                                            navigate(`/books/${row.id}`)
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
                (showAddBookDialog && <AddBook open={showAddBookDialog} setOpen={setShowAddBookDialog} updateBooks={updateBooks} />)
            }
        </>
    );
}

export default memo(Books);