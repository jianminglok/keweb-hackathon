import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFindUser from './useFindUser';

export default function useLogout() {
    let navigate = useNavigate();

    const { user, setUser, isLoading } = useFindUser();

    const logoutUser = async () => {
        try {
            await axios({
                method: 'DELETE',
                url: `/api/logout`,
            }).then(res => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('firstName');
                localStorage.removeItem('lastName');
                localStorage.removeItem('hallName');
                navigate('/');
                location.reload();
            })
        } catch (err) {
        }
    }

    return {
        logoutUser
    }

}