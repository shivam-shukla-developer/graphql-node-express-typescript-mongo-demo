import { memo, useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { getBook, updateBook } from '../../services/books';
import { getAuthors } from '../../services/author';
import { Alert, Box, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function EditBook() {
    const params = useParams();
    const [authors, setAuthors] = useState([]);
    const [book, setBook] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');

    const fetchBook = useCallback(async () => {
        try {
            const response = await getBook(params.bookId, `id, name, description, url author {id}`);
            const { data: { data: { book: data } }, data: { errors } } = response;
            if (errors) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                throw new Error(errorMessages.join(", "));
            }
            data.author = data.author.id;
            setBook(data);
        } catch (error) {
            setAlertMessage(error.message);
            setAlertType('error');
            setShowAlert(true);
        }
    }, [params])

    useEffect(() => {
        fetchBook();
        getAuthors().then(response => {
            const { data: { data: { authors: data } } } = response;
            if (data) setAuthors(data)
        })
    }, [fetchBook]);

    const submitCallback = async () => {
        try {
            if (book.name.length < 4) throw new Error("Book Name can not be less than 4 characters.");
            if (!book.author) throw new Error("Author Name can not be empty.");
            if (book.url !== '' && !isUrlValid(book.url)) throw new Error("Please specify valid book preview url.");
            const response = await updateBook(book);
            const { data: { data: { updateBook: data } }, data: { errors } } = response;
            if (errors) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                throw new Error(errorMessages.join(", "));
            }
            setAlertMessage(`Book ${data.name} Updated Successfully.`);
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
            {book && <>
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
                    <FormControl sx={{ width: "100%", mb: 3 }}>
                        <TextField fullWidth label="Name" id="book_name" value={book.name} onChange={(e) => setBook({ ...book, name: e.target.value })} />
                    </FormControl>

                    <FormControl sx={{ width: "100%", mb: 3 }}>
                        <TextField fullWidth label="Description" value={book.description} onChange={(e) => setBook({ ...book, description: e.target.value })} />
                    </FormControl>

                    <FormControl sx={{ width: "100%", mb: 3 }}>
                        <TextField fullWidth label="Preview Url" value={book.url} onChange={(e) => setBook({ ...book, url: e.target.value })} />
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="author-label">Author</InputLabel>
                        <Select
                            labelId="author-label"
                            value={book.author}
                            label="Author"
                            onChange={(e) => setBook({ ...book, author: e.target.value })}
                        >
                            {authors.map((author) => <MenuItem key={author.id} value={author.id}>{author.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2} sx={{ mt: 1, ml: 3 }}>
                        <Button variant="contained" onClick={submitCallback}>Save Changes</Button>
                    </Stack>
                </Box>

            </>}
        </div>
    )
}

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g); // eslint-disable-line
    if(res == null) return false;
    else return true;
}


export default memo(EditBook);