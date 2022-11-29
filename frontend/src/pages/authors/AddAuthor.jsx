import {useState, memo} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Alert} from '@mui/material';
import { addAuthor } from '../../services/author';

function AddAuthor({ open, setOpen, updateUsers }) {
    const [userName, setuserName] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('error');

    const handleClose = () => {
        setOpen(false);
    };
    
    const saveAuthor = async () => {
        try {
            if (userName.length < 4) throw new Error("Author Name can not be less than 4 characters.");
            const response = await addAuthor({name: userName});
            const {data: {data : {addAuthor : data}}, data: {errors}} = response;
            if (errors) {
                const errorMessages = errors.reduce((prevValue, currentValue) => {
                    if (currentValue.message !== undefined) prevValue.push(currentValue.message);
                    return prevValue;
                }, [])
                throw new Error (errorMessages.join(", "));
            }
            setAlertMessage(`Author ${data.name} Created Successfully.`);
            setAlertType('success');
            setShowAlert(true);
            setuserName('');
            updateUsers();
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
                <DialogTitle>Add Author</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new author on this website, please enter user details here and click on create button. You can can abort the operation by clicking on the cancel button.

                    </DialogContentText>
                    {showAlert && <Alert sx={{mt:2}} severity={alertType}>{alertMessage}</Alert> }

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Author Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{minLength : 4, maxLength: 30 }}
                        value = {userName}
                        onChange={(e) => setuserName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveAuthor}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default memo(AddAuthor);