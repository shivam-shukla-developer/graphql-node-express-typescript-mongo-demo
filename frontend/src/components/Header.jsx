import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    const [value, setValue] = React.useState((location.pathname.includes("authors") ? 'authors' : 'books'));
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
            >
                <Tab value="books" label="Books" to="/books" component={Link} />
                <Tab value="authors" label="Authors" to="/authors" component={Link} />
            </Tabs>
        </Box>
    );
}