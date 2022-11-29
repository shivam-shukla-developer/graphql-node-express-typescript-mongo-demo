import { memo, useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { getAuthor, updateAuthor } from '../../services/author';
import { Alert, Box, TextField, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Link } from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

function EditAuthor() {
    const params = useParams();
    const [author, setAuthor] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');
    
    const fetchAuthor = useCallback(async () => {
        try {
            const response = await getAuthor(params.authorId, `id, name, books {id, name, description, url}`);
            const { data: { data: { author: data } }, data: { errors } } = response;
            if (errors) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                throw new Error(errorMessages.join(", "));
            }

            setAuthor(data);
        } catch (error) {
            setAlertMessage(error.message);
            setAlertType('error');
            setShowAlert(true);
        }
    }, [params])

    useEffect(() => {
        fetchAuthor();
    }, [fetchAuthor]);

    const submitCallback = async () => {
        try {
            if (author.name.length < 4) throw new Error("Author Name can not be less than 4 characters.");
            const response = await updateAuthor(`id:"${author.id}", name: "${author.name}"`);
            const {data: {data : {updateAuthor : data}}, data: {errors}} = response;
            if (errors) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                throw new Error (errorMessages.join(", "));
            }
            setAlertMessage(`Author ${data.name} Updated Successfully.`);
            setAlertType('success');
            setShowAlert(true);
        } catch (error) {
            setAlertMessage(error.message);
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setTimeout(() => {
                setShowAlert(false);
            }, 3000)
        }
    }

    return (
        <div>
            {showAlert && <Alert sx={{ mt: 2 }} severity={alertType}>{alertMessage}</Alert>}
            {author && <>
                <Box
                    sx={{
                        // width: 500,
                        ml: 5,
                        mt: 2,
                        p: 2,
                        maxWidth: '100%',
                        borderTop: 'var(--Grid-borderWidth) solid',
                        borderLeft: 'var(--Grid-borderWidth) solid',
                    }}
                >
                    <TextField fullWidth label="Author Name" id="author_name" value={author.name} onChange={(e) => setAuthor({ ...author, name: e.target.value })} />
                    <Stack direction="row" spacing={2} sx={{ mt: 3, ml: 3 }}>
                        <Button variant="contained" onClick={submitCallback}>Save Changes</Button>
                    </Stack>

                    {author.books.length > 0 && <>
                        <Typography variant="h5" sx={{ mt: 5 }} gutterBottom>
                            List of Books Written by the Author
                        </Typography>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Description</TableCell>
                                        <TableCell align="left">Preview</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {author.books.map((book) => (
                                        <TableRow
                                            key={book.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="book">
                                                <Link to={`/books/${book.id}`} component={RouterLink} underline="always">
                                                    {book.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="left">{(book.description ? book.description : '-')}</TableCell>
                                            <TableCell align="left">{(book.url ? <Link target="_blank" href={book.url} underline="always">
                                                {book.url}
                                            </Link> : '-')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>}
                </Box>

            </>}
        </div>
    )
}

export default memo(EditAuthor);