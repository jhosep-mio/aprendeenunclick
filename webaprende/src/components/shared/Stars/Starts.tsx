import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';


export default function Estrellas() {
  
    return (
        <Stack spacing={1} className='estrellas2'>
            <Rating name="size-large" defaultValue={8} size="large" readOnly/>
        </Stack>
    );
}