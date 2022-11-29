import { useState, memo, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { addBook } from '../../services/books';
import { getAuthors } from '../../services/author';

function AddBook({ open, setOpen, updateBooks }) {
    const [book, setBook] = useState({
        name: '',
        description: '',
        author: '',
        url: ''
    });
    const [authors, setAuthors] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getAuthors().then(response => {
            const { data: { data: { authors: data } } } = response;
            if (data) setAuthors(data)
        })
    }, [])
    const saveBook = async () => {
        try {
            if (book.name.length < 4) throw new Error("Book Name can not be less than 4 characters.");
            if (!book.author) throw new Error("Author Name can not be empty.");
            if (book.url !== '' && !isUrlValid(book.url)) throw new Error("Please specify valid book preview url.");
            const response = await addBook(book);
            const { data: { data: { addBook: data } }, data: { errors } } = response;
            if (errors) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                throw new Error(errorMessages.join(", "));
            }
            setAlertMessage(`Book ${data.name} Created Successfully.`);
            setAlertType('success');
            setShowAlert(true);
            setBook({
                name: '',
                description: '',
                author: '',
                url: ''
            });
            updateBooks();
            setTimeout(handleClose, 2000);
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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new book on this website, please enter book details here and click on create button. You can can abort the operation by clicking on the cancel button.

                    </DialogContentText>
                    {showAlert && <Alert sx={{ mt: 2 }} severity={alertType}>{alertMessage}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Book Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{ minLength: 4, maxLength: 300 }}
                        value={book.name}
                        onChange={(e) => setBook({ ...book, name: e.target.value })}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Book Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{ minLength: 4, maxLength: 1000 }}
                        value={book.description}
                        onChange={(e) => setBook({ ...book, description: e.target.value })}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="url"
                        label="Book Preview Url"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{ minLength: 4, maxLength: 300 }}
                        value={book.url}
                        onChange={(e) => setBook({ ...book, url: e.target.value })}
                    />

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

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveBook}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g); // eslint-disable-line
    if(res == null) return false;
    else return true;
}

export default memo(AddBook);