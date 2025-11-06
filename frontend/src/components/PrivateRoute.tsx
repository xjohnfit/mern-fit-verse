import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/login' />
    );
};
export default PrivateRoute;